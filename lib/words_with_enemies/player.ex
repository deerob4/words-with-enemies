defmodule WordsWithEnemies.Player do
  @moduledoc """
  A struct and related functions for describing
  a player in a multiplayer game.
  """

  alias WordsWithEnemies.{Player}

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
  Adds `letter` to the list of letters in `player`. Letter must
  be a string containing a single character between `a..z` or `A..Z`.
  """
  def add_letter(%Player{letters: letters} = player, letter) do
    if valid_letter?(letter) do
      Map.put(player, :letters, [letter | letters])
    else
      player
    end
  end

  @doc """
  Removes the first occurence of `letter` from `player`'s letters.
  """
  def remove_letter(%Player{letters: letters} = player, letter) do
    Map.put(player, :letters, List.delete(letters, letter))
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

  defp valid_letter?(letter) do
    ?a..?z
    |> Enum.concat(?A..?Z)
    |> Enum.to_list
    |> List.to_string
    |> String.codepoints
    |> Enum.member?(letter)
  end
end
