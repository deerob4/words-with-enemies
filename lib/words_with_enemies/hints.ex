defmodule WordsWithEnemies.Hints do
  @moduledoc """
  Contains functions that provide hints for various
  aspects of the game, such as definitions for
  possible words.
  """

  @mashape_key "dZbkJBM2PJmshW7Kx3dtM2IIHbeLp1KcMDwjsnVONurSIqp4RW"

  import WordsWithEnemies.WordFinder
  import WordsWithEnemies.Endpoint, only: [broadcast!: 3]

  @doc """
  Broadcasts the definitions of up to ten words
  that can be made using `letters`.
  """
  def from_letters(letters, opts \\ []) do
    min = Keyword.get(opts, :min, 4)
    max = Keyword.get(opts, :max, 15)

    word_list()
    |> using(letters)
    |> between(min: min, max: max)
    |> Enum.take_random(10)
    |> Stream.map(&define/1)
    |> Stream.filter(fn
         {:ok, definition} -> true
         {:error, _reason} -> false
       end)
    |> Stream.map(fn({:ok, definition}) -> definition end)
    |> Enum.to_list
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

  defp extract_definition(%{"word" => word, "results" => [%{"definition" => definition, "partOfSpeech" => part} | _]}) do
    {:ok, %{word: word, definition: definition, part: part}}
  end
  defp extract_definition(_no_definition) do
    {:error, :no_definition}
  end

  defp definition_url(word) do
    "https://wordsapiv1.p.mashape.com/words/" <> word
  end
end
