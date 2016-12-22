defmodule WordsWithEnemies.Game do
  @moduledoc """
  A struct  describing a multiplayer game.
  """

  defstruct id: nil, round: 1, players: [], status: :waiting_for_players
end
