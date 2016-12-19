defmodule WordsWithEnemies.Game do
  @moduledoc """
  A struct and related functions for describing
  a multiplayer game.
  """

  alias WordsWithEnemies.{Game, Player}

  defstruct id: nil, round: 1, players: []

  @doc """
  Returns `game` with the `round` key incremented by 1.
  """
  def increment_round(%Game{round: round} = game) do
    Map.put(game, :round, round+1)
  end

  @doc """
  Adds `player` to the list of players in `game`.
  """
  def add_player(%Game{players: players} = game, %Player{} = player) do
    Map.put(game, :players, [player | players])
  end

  @doc """
  Returns `game` without the player who's name is `name`.
  """
  def remove_player(%Game{players: players} = game, name) do
    Map.put(game, :players, Enum.filter(players, &(&1.name !== name)))
  end
end
