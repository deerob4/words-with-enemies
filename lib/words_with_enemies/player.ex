defmodule WordsWithEnemies.Player do
  @moduledoc """
  A struct and related functions for describing
  a player in a multiplayer game.
  """

  alias WordsWithEnemies.{Player, Letters}

  defstruct name: nil, score: 0, letters: []

  @doc """
  Returns `player` with the `score` key incremented by 1.
  """
  def increment_score(%Player{score: score} = player) do
    %{player | score: score+1}
  end

  @doc """
  Returns `player` with the `score` key decremented by 1.
  """
  def decrement_score(%Player{score: score} = player) do
    %{player | score: score-1}
  end

  @doc """
  Replaces the letters for `player` with the new `letters`.
  `letters` should be a list of single character strings, each
  between between `a..z` or `A..Z`.
  """
  def set_letters(%Player{} = player, letters) do
    if Enum.all?(letters, &valid_letter?/1) do
      Map.put(player, :letters, letters)
    else
      player
    end
  end

  @doc """
  Replaces the player's letters with a randomly generated set.
  `difficulty` can be either `"easy"` (default), `"medium"`, or
  `"hard"`, depending on the game mode.
  """
  def set_random_letters(%Player{} = player, difficulty \\ "easy") do
    set_letters(player, Letters.generate_set(:player, difficulty))
  end

  @doc """
  Returns `true` if `player` is a `%Player{}` struct, otherwise false.`
  """
  def player?(%Player{}),   do: true
  def player?(_not_player), do: false

  defp valid_letter?(letter) do
    ?a..?z
    |> Enum.concat(?A..?Z)
    |> Enum.to_list
    |> List.to_string
    |> String.codepoints
    |> Enum.member?(letter)
  end
end
