defmodule WordsWithEnemies.Game.Server do
  @moduledoc """
  A process for controlling an individual game.
  """

  use GenServer
  require Logger
  alias WordsWithEnemies.Game.Lobby
  alias WordsWithEnemies.{Game, Player}

  @doc """
  Starts a new game process, and returns `{:ok, pid}`.
  """
  def start_link(id, players) when is_list(players) do
    if Enum.all?(players, &Player.player?/1) do
      game = %Game{id: id, players: players}
      name = {:via, Registry, {WordsWithEnemies.Game.Registry, id}}
      GenServer.start_link(__MODULE__, game, name: name)
    else
      raise("invalid players passed")
    end
  end

  @doc """
  Increment's the game's round number by 1.
  """
  def increment_round(pid) do
    GenServer.cast(pid, :increment_round)
  end

  @doc """
  Adds `player` to the list of players.
  """
  def add_player(pid, %Player{} = player) do
    GenServer.cast(pid, {:add_player, player})
  end

  @doc """
  Returns `game` without the player who's name is `name`.
  """
  def remove_player(pid, name) do
    GenServer.cast(pid, {:remove_player, name})
  end

  @doc """
  Set's the `status` key to `in_progress`.
  """
  def begin_game(pid) do
    GenServer.cast(pid, :begin_game)
  end

  @doc """
  Returns the player with `name` if they exist, otherwise `nil`.
  """
  def find_player(pid, name) do
    GenServer.call(pid, {:find_player, name})
  end

  @doc """
  Calls `func` on each player struct in the game, and
  sets the result to the `players` key.
  """
  def update_players(pid, func) when is_function(func) do
    GenServer.cast(pid, {:update_players, func})
  end

  @doc """
  Calls `func` on the player with `name`, and replaces
  that player's struct with the result. Returns `:player_not_found`
  if the player doesn't exist.
  """
  def update_player(pid, id, func) when is_function(func) do
    GenServer.cast(pid, {:update_player, id, func})
  end

  @doc """
  Replaces the games players with `players`, which must be
  a list of `%Player{}` structs. Returns `:invalid_players` if
  the list contains anything else.
  """
  def replace_players(pid, players) do
    if Enum.all?(players, &Player.player?/1) do
      GenServer.cast(pid, {:replace_players, players})
    else
      raise("invalid players passed")
    end
  end

  @doc """
  Gives every player a new set of letters.
  """
  def distribute_letters(pid) do
    update_players(pid, &Player.set_random_letters/1)
  end

  @doc """
  Returns the inner struct of the game.
  """
  def lookup(pid) do
    GenServer.call(pid, :lookup)
  end

  @doc """
  Terminates the game.
  """
  def stop(pid) do
    GenServer.stop(pid)
  end

  # Server

  def init(%Game{id: id} = game) do
    Logger.info("Game:#{id} has initialised")
    Lobby.add_game(game)
    {:ok, game}
  end

  def terminate(:normal, %Game{id: id} = game) do
    Logger.info("Game:#{id} has terminated")
    Lobby.remove_game(id)
    :normal
  end

  def handle_call(:lookup, _from, game) do
    {:reply, game, game}
  end

  def handle_call({:find_player, name}, _from, game) do
    player = Enum.find(game.players, &(&1.name === name))
    {:reply, player, game}
  end

  def handle_cast(:begin_game, game) do
    Logger.info("Game:#{game.id} has started")
    Lobby.remove_game(game.id)
    {:noreply, %{game | status: :in_progress}}
  end

  def handle_cast(:increment_round, game) do
    {:noreply, %{game | round: game.round+1}}
  end

  def handle_cast({:add_player, player}, game) do
    Logger.info("#{player.name} was added to game:#{game.id}")
    {:noreply, %{game | players: [player | game.players]}}
  end

  def handle_cast({:remove_player, name}, game) do
    filtered = Enum.filter(game.players, &(&1.name !== name))
    {:noreply, %{game | players: filtered}}
  end

  def handle_cast({:update_players, func}, game) do
    new_players = Enum.map(game.players, &func.(&1))
    {:noreply, %{game | players: new_players}}
  end

  def handle_cast({:update_player, id, func}, %Game{players: players} = game) do
    index = Enum.find_index(players, &(&1.id == id)) || length(players)
    new_players = List.update_at(players, index, &func.(&1))
    {:noreply, %{game | players: new_players}}
  end

  def handle_cast({:replace_players, players}, game) do
    {:noreply, %{game | players: players}}
  end
end
