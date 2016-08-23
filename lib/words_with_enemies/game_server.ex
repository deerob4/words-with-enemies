defmodule WordsWithEnemies.GameServer do
  use GenServer
  alias WordsWithEnemies.GameServer

  defstruct id: nil,
            letters: [10],
            host: %{id: nil, name: nil},
            opponent: %{id: nil, name: nil},
            status: :waiting

  # Client

  @doc "Creates a new game process using `params`."
  def start_link(%{id: _, host: %{id: _, name: _}} = params) do
    state = struct(GameServer, params)
    GenServer.start_link(__MODULE__, state)
  end

  @doc "Returns the state of the game running at `pid`."
  def get_state(pid) do
    GenServer.call(pid, :get_state)
  end

  def set_opponent(pid, %{opponent: %{id: _, name: _}} = params) do
    GenServer.cast(pid, {:set_opponent, params})
  end

  def set_letters(pid, user, letters) do
    GenServer.cast(pid, {:set_letters, user, letters})
  end

  @doc "Terminates the game running at `pid`."
  def stop(pid) do
    GenServer.stop(pid)
  end

  def valid_letter?(pid, letter_id) do
    GenServer.call(pid, {:valid_letter, letter_id})
  end

  # Server

  def handle_call(:get_state, _from, state) do
    {:reply, state, state}
  end

  def handle_call({:valid_letter, letter_id}, _from, state) do
    valid? = letter_id in state.letters
    {:reply, valid?, state}
  end

  def handle_cast({:set_opponent, opponent}, _from, state) do
    {:noreply, Map.merge(state, opponent)}
  end

  def terminate(state) do
    {:stop, :normal, %{state | stage: :finished}}
  end
end
