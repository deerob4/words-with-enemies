defmodule WordsWithEnemies.Hints do
  @moduledoc """
  Contains functions that provide hints for various
  aspects of the game, such as definitions for
  possible words.
  """

  @mashape_key "dZbkJBM2PJmshW7Kx3dtM2IIHbeLp1KcMDwjsnVONurSIqp4RW"

  import WordsWithEnemies.WordFinder
  import WordsWithEnemies.Endpoint, only: [broadcast!: 3]

  def from_letters(letters, opts \\ []) do
    min = Keyword.get(opts, :min, 4)
    max = Keyword.get(opts, :max, 15)

    remove_failures = fn
      {_word, {:ok, _definition, _part}} -> true
      {_word, {:error, _reason}} -> false
    end

    build_map = fn {word, {:ok, definition, part}} ->
      %{word: word, definition: definition, part: part}
    end

    hints =
      word_list
      |> using(letters)
      |> between(min: min, max: max)
      |> Enum.take_random(10)
      |> Stream.map(fn word -> {word, define(word)} end)
      |> Stream.filter_map(&remove_failures.(&1), &build_map.(&1))
      |> Enum.to_list

    broadcast!("games:ai", "receive_hint", %{hints: hints})
  end

  defp define(word) do
    url = definition_url(word)
    headers = [{"X-Mashape-Key", @mashape_key}]

    case HTTPoison.get(url, headers) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        body
        |> Poison.decode!
        |> extract_definition

      {:ok, %HTTPoison.Response{status_code: 404}} ->
        {:error, :not_found}

      {:error, %HTTPoison.Error{reason: reason}} ->
        {:error, reason}
    end
  end

  defp extract_definition(%{"results" => [%{"definition" => definition, "partOfSpeech" => part} | _]}) do
    {:ok, definition, part}
  end
  defp extract_definition(_no_definition) do
    {:error, :no_definition}
  end

  defp definition_url(word) do
    "https://wordsapiv1.p.mashape.com/words/" <> word
  end
end
