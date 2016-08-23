defmodule WordsWithEnemies.GameRegistry do
  use GenServer
  alias WordsWithEnemies.{GameServer}

  def start_link do
    GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  end

  # Client

  @doc "Creates a new game process and adds it to the registry."
  def add_game(%{host: %{name: _, id: _}} = host) do
    GenServer.call(__MODULE__, {:add_game, host})
  end

  @doc "Removes the game with `id` from the registry, ending it."
  def delete_game(id) do
    GenServer.cast(__MODULE__, {:delete_game, id})
  end

  @doc "Returns a map of all active game processes."
  def list do
    GenServer.call(__MODULE__, :list)
  end

  @doc "Returns the PID of the game with id `id`."
  def get_pid(id) do
    GenServer.call(__MODULE__, {:get_pid, id})
  end

  # Server

  def handle_call(:list, _from, games) do
    {:reply, games, games}
  end

  def handle_call({:get_pid, id}, _from, games) do
    {:reply, Map.get(games, id), games}
  end

  def handle_call({:add_game, host}, _from, games) do
    # The game's unique id
    id = System.unique_integer([:positive])
    game = Map.merge(%{id: id}, host)

    {:ok, pid} = GameServer.start_link(game)

    {:reply, id, Map.put(games, id, pid)}
  end

  def handle_cast({:delete_game, id}, games) do
    pid = Map.get(games, id)

    if pid, do: GameServer.stop(pid)

    {:noreply, Map.delete(games, id)}
  end
end
