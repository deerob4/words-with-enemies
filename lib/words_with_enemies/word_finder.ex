defmodule WordsWithEnemies.WordFinder do
  @moduledoc """
  Uses the Stream API to efficiently search a wordlist
  for words based on certain criteria. Each function takes
  and returns a stream, allowing for easy chaining. When the
  chain is complete, a function in the `Enum` module must be
  used to retrieve the words. For example:

      words
      |> using("peiaewneolafdqe")
      |> between(min: 8, max: 12)
      |> starting_with("p")
      |> Enum.take(1)

      ["palinode"]
  """

  alias WordsWithEnemies.Letters

  @wordlist "priv/static/sowpods.txt"

  @doc """
  Transforms the wordlist into a list, and stores
  it in an agent for efficient access later on.
  """
  def start_link do
    words =
      @wordlist
      |> File.read!
      |> String.split("\n", trim: true)

    Agent.start_link(fn -> words end, name: __MODULE__)
  end

  @doc """
  Returns all words in the word list.
  """
  @spec words :: list
  def words, do: Agent.get(__MODULE__, &(&1))

  @doc """
  Returns a stream of `words` that can be made from `letters`.
  """
  @spec using(Enumerable.t, list) :: Enumerable.t
  @spec using(Enumerable.t, String.t) :: Enumerable.t

  def using(words, letters) when is_list(letters) do
    words |> Stream.filter(&possible?(&1, letters))
  end
  def using(words, letters) when is_bitstring(letters) do
    using(words, String.codepoints(letters))
  end

  defp possible?(word, letters) when length(word) > length(letters), do: false
  defp possible?(word, letters) when is_bitstring(word) do
    word
    |> String.codepoints
    |> do_possible?(letters)
  end

  defp do_possible?([], _letters), do: true
  defp do_possible?([letter|others], letters) do
    if letter in letters do
      do_possible?(others, List.delete(letters, letter))
    else
      false
    end
  end

  @doc """
  Returns a stream of `words` that are between `min`
  and `max` characters in length.
  """
  @spec between(Enumerable.t, list) :: Enumerable.t
  def between(words, [min: min]) do
    words |> Stream.filter(&min_length?(&1, min))
  end
  def between(words, [max: max]) do
    words |> Stream.filter(&max_length?(&1, max))
  end
  def between(words, [min: min, max: max]) do
    words |> Stream.filter(&length_between?(&1, min, max))
  end

  defp min_length?(word, min) do
    String.length(word) >= min
  end
  defp max_length?(word, max) do
    String.length(word) <= max
  end
  defp length_between?(word, min, max) do
    min_length?(word, min) and max_length?(word, max)
  end

  @doc """
  Returns a stream of `words` that meet the criteria in
  `constraints`. This is a map containing letters and
  the amount they should appear in the word. For example,
  `%{a: 4, k: 2}` will return all words with exactly 4 a's and 2 k's.
  """
  @spec containing(Enumerable.t, map, list) :: Enumerable.t
  def containing(words, constraints, opts \\ []) do
    opts = Keyword.put_new(opts, :precise, true)
    words |> Stream.filter(&contains?(&1, constraints, opts))
  end

  defp contains?(word, constraints, [precise: precise]) do
    word_freqs = Letters.frequency_table(word)
    constraints = atom_keys_to_string(constraints)

    if has_keys?(word_freqs, constraints) do
      word_keys = Map.keys(word_freqs)

      constraints
      |> Map.keys
      |> Enum.all?(&do_contains?(&1, word_freqs, constraints, precise))
    else
      false
    end
  end

  defp do_contains?(char, word_freqs, constraints, true) do
    word_freqs[char] == constraints[char]
  end
  defp do_contains?(char, word_freqs, constraints, false) do
    word_freqs[char] >= constraints[char]
  end

  defp has_keys?(checking, keys) do
    keys |> Map.keys |> Enum.all?(&(&1 in Map.keys(checking)))
  end

  defp atom_keys_to_string(map) do
    for {key, val} <- map, into: %{} do
      {Atom.to_string(key), val}
    end
  end

  @doc """
  Returns a stream of `words` that begin with `prefix`.
  """
  @spec starting_with(Enumerable.t, String.t | [String.t]) :: Enumerable.t
  def starting_with(words, prefix) do
    words |> Stream.filter(&String.starts_with?(&1, prefix))
  end

  @doc """
  Returns a stream of `words` that begin with `suffix`.
  """
  @spec ending_with(Enumerable.t, String.t | [String.t]) :: Enumerable.t
  def ending_with(words, suffix) do
    words |> Stream.filter(&String.ends_with?(&1, suffix))
  end

  @doc "Returns `true` if `word` is valid."
  @spec valid?(String.t) :: boolean
  def valid?(word), do: word in words

  @doc """
  Returns the similarity value of two words as a value
  from 0 - 1, taking into account the length of the words
  and the letters that the two have in common.

  ## Examples

    iex> WordFinder.similarity "pineapple", "apple"
    1

    iex> WordFinder.similarity "cozy", "fullers"
    0
  """
  @spec similar_to(Enumerable.t, String.t, integer) :: Enumerable.t
  def similar_to(words, compare_word, min_similarity) do
    Stream.filter(words, fn word ->
      similarity(word, compare_word) >= min_similarity
    end)
  end

  @spec similarity(String.t, String.t) :: integer
  def similarity(a, b) do
    a
    |> compare_words(b)
    |> do_similarity
  end

  defp do_similarity({[_|_], []}), do: 0
  defp do_similarity

  @doc ~S"""
  Compares the contents of two strings and removes
  any duplicates between them on a 1:1 basis.

  ## Examples

      iex> WordFinder.compare "pineapple", "planet"
      {["i", "p", "p", "e"], ["t"]}

      iex> WordFinder.compare "pineapple", "apple"
      {["p", "i", "n", "e"], []}
  """
  @spec compare_words(String.t, String.t) :: {String.t, String.t}
  @spec compare_words(list, list) :: {String.t, String.t}

  def compare_words(a, b) when is_bitstring(a) and is_bitstring(b) do
    a = a |> String.codepoints
    b = b |> String.codepoints
    compare_words(a, b)
  end
  def compare_words(word_a, word_b) do
    do_compare_words(word_a, word_a, word_b)
  end

  defp do_compare_words([], word_a, word_b), do: {word_a, word_b}
  defp do_compare_words([current|others], word_a, word_b) do
    if current in word_a and current in word_b do
      word_a = word_a |> List.delete(current)
      word_b = word_b |> List.delete(current)
      do_compare_words(others, word_a, word_b)
    else
      do_compare_words(others, word_a, word_b)
    end
  end
end
