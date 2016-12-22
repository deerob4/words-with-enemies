defmodule WordsWithEnemies.Letters do
  @moduledoc """
  Provides a set of functions for intelligently creating
  sets of letters. Uses Robert Lewand's letter frequencies
  and Herbert Zim's common pairs.
  """

  import Enum, only: [random: 1, take_random: 2]
  import WordsWithEnemies.WordFinder, only: [word_list: 0, using: 2]

  @pairs [
    {"t", "h"}, {"h", "e"}, {"a", "n"}, {"r", "e"}, {"o", "n"},
    {"a", "t"}, {"n", "d"}, {"s", "t"}, {"n", "g"}, {"o", "f"},
    {"t", "e"}, {"e", "d"}, {"o", "r"}, {"t", "i"}, {"a", "s"},
    {"t", "o"}, {"i", "n"}, {"e", "n"}, {"h", "i"}
  ]

  @high_freq ["e", "t", "a", "o", "i", "n", "s", "h", "r", "d"]
  @med_freq ["l", "c", "u", "m", "w", "f", "g", "y", "p", "b"]
  @low_freq ["v", "k", "j", "x", "q", "z"]

  @alphabet Enum.sort(@high_freq ++ @med_freq ++ @low_freq)

  @doc """
  Generates a list of letters based on the difficulty.
  """
  @spec generate_set(:player | :ai, String.t) :: list
  def generate_set(:player, "easy") do
    frequencies(%{high: 5, med: 4, low: 2, pairs: 2}) # 20
  end
  def generate_set(:player, "medium") do
    frequencies(%{high: 5, med: 4, low: 4, pairs: 2}) # 15
  end
  def generate_set(:player, "hard") do
    frequencies(%{high: 3, med: 3, low: 4, pairs: 1}) # 8
  end
  def generate_set(:ai, "easy") do
    frequencies(%{high: 3, med: 3, low: 4, pairs: 1}) # 12
  end
  def generate_set(:ai, "medium") do
    frequencies(%{high: 5, med: 4, low: 4, pairs: 1}) # 15
  end
  def generate_set(:ai, "hard") do
    frequencies(%{high: 7, med: 6, low: 5, pairs: 2}) # 22
  end

  @spec frequencies(map) :: [String.t]
  defp frequencies(%{high: h, med: m, low: l, pairs: p}) do
    highs = @high_freq |> take_random(h)
    meds = @med_freq |> take_random(m)
    lows = @low_freq |> take_random(l)
    pairs = @pairs |> take_random(p) |> get_pairs

    Enum.shuffle(highs ++ meds ++ lows ++ pairs)
  end

  @spec get_pairs([{String.t , String.t}]) :: [String.t]
  defp get_pairs(pairs) do
    pairs
    |> Enum.map(&Tuple.to_list/1)
    |> List.flatten
  end

  @doc """
  Appends a new letter to `letters`, based on the frequency
  of letters currently in the list.
  """
  @spec add_letter(list) :: String.t
  def add_letter(letters) do
    case prevailing_freq(letters) do
      :high -> letters ++ random(@low_freq)
      :med  -> letters ++ random(@low_freq)
      :low  -> letters ++ random(@high_freq)
    end
  end

  @spec prevailing_freq([String.t]) :: integer
  defp prevailing_freq(letters) do
    freqs = %{high: count_highs(letters),
              med: count_meds(letters),
              low: count_lows(letters)}

    {freq, _count} = Enum.max(freqs)
    freq
  end

  defp count_highs(letters) do
    Enum.count(letters, &(&1 in @high_freq))
  end
  defp count_meds(letters) do
    Enum.count(letters, &(&1 in @med_freq))
  end
  defp count_lows(letters) do
    Enum.count(letters, &(&1 in @low_freq))
  end

  @doc """
  Returns the most common item in `list`, or `nil` if
  there isn't one.
  """
  @spec most_common(list) :: any
  def most_common([n]), do: n
  def most_common(list) do
    list
    |> frequency_table
    |> Enum.max_by(&elem(&1, 1))
    |> do_most_common
  end

  defp do_most_common({_item, count}) when count <= 1, do: nil
  defp do_most_common({item, _count}), do: item

  @doc """
  Constructs a map containing each item in `list`,
  and the number of times each one appears.
  """
  @spec frequency_table(String.t) :: map
  @spec frequency_table(list) :: map

  def frequency_table(string) when is_bitstring(string) do
    string
    |> String.codepoints
    |> frequency_table
  end
  def frequency_table(list) when is_list(list) do
    Enum.reduce(list, %{}, fn (item, freqs) ->
      Map.update(freqs, item, 1, &(&1 + 1))
    end)
  end
end
