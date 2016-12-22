defmodule WordsWithEnemies.Game.Supervisor do
  @moduledoc """
  Supervises game servers.
  """

  use Supervisor

  def start_link() do
    Supervisor.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_) do
    children = [
      worker(WordsWithEnemies.Game.Server, [], restart: :transient)
    ]

    supervise(children, strategy: :simple_one_for_one)
  end
end
