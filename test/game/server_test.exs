defmodule WordsWithEnemies.Game.ServerTest do
  use ExUnit.Case, async: true
  alias WordsWithEnemies.{Game, Player}
  alias WordsWithEnemies.Game.Server

  @dee %Player{name: "deerob4"}
  @keir %Player{name: "theunlawfultruth"}

  setup do
    id = System.unique_integer([:positive])
    players = [@dee]
    {:ok, game} = Server.start_link(id, players)

    {:ok, id: id, game: game}
  end

  test "looks up correct game", %{id: id, game: game} do
    correct = %Game{id: id, players: [@dee]}
    assert Server.lookup(game) == correct
  end

  test "increments round", %{game: game} do
    Server.increment_round(game)
    %Game{round: round} = Server.lookup(game)
    assert round == 2
  end

  test "finds players", %{game: game} do
    player = Server.find_player(game, "deerob4")
    assert player == @dee
  end

  test "adds players", %{game: game} do
    Server.add_player(game, @keir)
    %Game{players: players} = Server.lookup(game)

    assert players == [@keir, @dee]
  end

  test "removes players", %{game: game} do
    Server.add_player(game, @keir)
    Server.remove_player(game, "theunlawfultruth")
    %Game{players: players} = Server.lookup(game)

    assert players == [%Player{name: "deerob4"}]
  end

  test "begins the game", %{game: game} do
    Server.begin_game(game)
    %Game{status: status} = Server.lookup(game)

    assert status == :in_progress
  end

  test "updates all the players", %{game: game} do
    Server.add_player(game, @keir)
    Server.update_players(game, &Map.put(&1, :name, String.upcase(&1.name)))

    correct = [%Player{name: "THEUNLAWFULTRUTH"}, %Player{name: "DEEROB4"}]
    %Game{players: players} = Server.lookup(game)

    assert players == correct
  end

  test "updates a single player", %{game: game} do
    Server.add_player(game, @keir)
    Server.update_player(game, "deerob4", &Map.put(&1, :name, String.upcase(&1.name)))

    correct = [%Player{name: "theunlawfultruth"}, %Player{name: "DEEROB4"}]
    %Game{players: players} = Server.lookup(game)

    assert players == correct
  end

  test "replaces players", %{game: game} do
    new_players = [%Player{name: "rosegifford"}, %Player{name: "jaydonnelly"}]
    Server.replace_players(game, new_players)

    %Game{players: players} = Server.lookup(game)
    assert players == new_players
  end

  test "raises if an invalid list of players is passed", %{game: game} do
    replace = fn -> Server.replace_players(game, [1, 2, 3]) end
    assert_raise RuntimeError, "invalid players passed", replace
  end

  test "distributes letters among all players", %{game: game} do
    Server.add_player(game, @keir)
    Server.distribute_letters(game)
    %Game{players: [%Player{letters: dee_letters}, %Player{letters: keir_letters}]} = Server.lookup(game)

    assert length(dee_letters) > 0 and length(keir_letters) > 0
  end
end
