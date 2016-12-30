defmodule WordsWithEnemies.GameChannel do
  @moduledoc """
  Contains callbacks that control the actual gameplay.
  """

  use WordsWithEnemies.Web, :channel

  import WordsWithEnemies.WordFinder, only: [word_list: 0, using: 2]

  alias WordsWithEnemies.{Game, Letters, WordFinder, Hints, Player}
  alias WordsWithEnemies.Game.Registry, as: GameRegistry
  alias WordsWithEnemies.Game.Server, as: GameServer

  @minimum_players 2

  @doc """
  Connect to a standard single player game.
  """
  def join("games:ai", _payload, socket) do
    {:ok, socket}
  end

  @doc """
  Connect to the multiplayer game. The player will already
  be a member if they've joined the game through the lobby.
  """
  def join("games:" <> game_id, _payload, socket) do
    game_id = String.to_integer(game_id)
    user_id = socket.assigns.user_id

    if can_join?(game_id, user_id) do
      send(self(), {:begin_game?, game_id})
      {:ok, socket}
    else
      {:error, %{reason: "unauthorised"}}
    end
  end

  def can_join?(game_id, player_id) do
    case GameRegistry.lookup(game_id) do
      {:ok, pid} ->
        %Game{players: players} = GameServer.lookup(pid)
        Enum.any?(players, &(&1.id === player_id))

      {:error, _reason} ->
        false
    end
  end


  @doc """
  Sends the initial set of letters, and hints for words that can
  be made from these letters, to the client.
  """
  def handle_in("games:start", %{"difficulty" => difficulty}, socket) do
    letters = get_hints_and_letters(difficulty)
    {:reply, {:ok, %{letters: letters}}, socket}
  end

  def handle_in("games:change_letters", %{"difficulty" => difficulty}, socket) do
    letters = get_hints_and_letters(difficulty)
    {:reply, {:ok, %{letters: letters}}, socket}
  end

  def handle_in("games:new_hints", %{"difficulty" => difficulty, "letters" => letters}, socket) do
    main_pid = self()
    spawn(fn -> get_hints(main_pid, letters, difficulty) end)
    {:reply, :ok, socket}
  end

  def get_hints_and_letters(difficulty) do
    main_pid = self() # keep reference for spawned function.
    letters = Letters.generate_set(:player, difficulty)
    # Get the hints in another process so we don't block everything else.
    spawn(fn -> get_hints(main_pid, letters, difficulty) end)
    letters
  end

  defp get_hints(main_pid, letters, difficulty) when is_pid(main_pid) do
    opts = hint_strength(difficulty)
    send(main_pid, {:send_hints, Hints.from_letters(letters, opts)})
  end

  defp hint_strength("easy"), do: [min: 5]
  defp hint_strength("medium"), do: [min: 4, max: 8]
  defp hint_strength("hard"), do: [min: 3, max: 5]

  @doc """
  Adds a new letter to the client's current set.
  """
  def handle_in("games:add_letter", %{"letters" => letters}, socket) do
    new_letter = Letters.add_letter(letters)
    {:reply, {:ok, %{letter: new_letter}}, socket}
  end

  @doc """
  Called when the user submits a word; returns either `true` or `false`
  depending on whether it's in the dictionary.
  """
  def handle_in("games:check_validity", %{"word" => word}, socket) do
    valid? = WordFinder.valid?(word)
    {:reply, {:ok, %{valid: valid?}}, socket}
  end

  @doc """
  Sends the client all the word that can be made from `letters`.
  """
  def handle_in("games:get_words", %{"letters" => letters}, socket) do
    words =
      word_list()
      |> using(letters)
      |> Enum.to_list
      |> sort_by_length

    {:reply, {:ok, %{words: words}}, socket}
  end

  defp sort_by_length(list) when is_list(list) do
    Enum.sort(list, &(String.length(&1) < String.length(&2)))
  end

  @doc """
  Informs all connected clients that a letter has been moved from the
  word bank to the word. Used in multiplayer games.
  """
  def handle_in("games:letter_to_word", %{"letter_id" => letter_id}, socket) do
    if valid_move?(letter_id, socket) do
      broadcast_from(socket, "letter_to_word", %{letter_id: letter_id})
    end

    {:reply, :ok, socket}
  end

  @doc """
  Informs all connected clients that a letter has been moved back from the
  word to the word bank. Used in multiplayer games.
  """
  def handle_in("games:letter_to_bank", %{"letter_id" => letter_id}, socket) do
    if valid_move?(letter_id, socket) do
      broadcast_from(socket, "letter_to_bank", %{letter_id: letter_id})
    end
  end

  def handle_in("games:generate_word", %{"difficulty" => difficulty, "user_word" => user_word}, socket) do
    letters = Letters.generate_set(:ai, difficulty)
    word = word_list |> using(letters) |> Enum.random
    {:reply, {:ok, %{word: word}}, socket}
  end

  @doc """

  """
  def handle_info({:begin_game?, game_id}, socket) do
    {:ok, pid} = GameRegistry.lookup(game_id)
    %Game{players: players} = GameServer.lookup(pid)

    if length(players) >= @minimum_players do
      GameServer.begin_game(pid)
      GameServer.distribute_letters(pid)
      %Game{players: players} = GameServer.lookup(pid)

      letter_indexes = map_letters_to_index(players)

      letters = %{
        indexedLetters: letter_indexes |> key_by_index |> keys_to_string,
        playerLetters: build_key_list(players, key_by_letter(letter_indexes), %{})
      }

      broadcast(socket, "begin_game", letters)
    end

    {:noreply, socket}
  end

  defp map_letters_to_index(players) do
    players
    |> Enum.map(fn(%Player{letters: letters}) -> letters end)
    |> List.flatten()
    |> Enum.with_index()
  end

  defp key_by_index(letters) do
    Enum.reduce(letters, %{}, fn({letter, index}, letters) ->
      Map.put(letters, index, letter)
    end)
  end

  defp key_by_letter(letters) do
    Enum.reduce(letters, %{}, fn({letter, index}, letters) ->
      Map.update(letters, letter, [index], &(&1 ++ [index]))
    end)
  end

  defp build_key_list([], _keys, results), do: results
  defp build_key_list([%Player{id: id, letters: letters} | rest], keys, results) do
    %{keys: keys, letter_keys: letter_keys} = do_build_key_list(letters, keys, [])
    results = Map.put(results, to_string(id), letter_keys)
    build_key_list(rest, keys, results)
  end

  defp do_build_key_list([], keys, letter_keys) do
    %{keys: keys, letter_keys: letter_keys}
  end
  defp do_build_key_list([letter|rest], keys, letter_keys) do
    [key | other_keys] = keys[letter]
    keys = Map.put(keys, letter, other_keys)
    do_build_key_list(rest, keys, letter_keys ++ [key])
  end

  defp keys_to_string(map) do
    Map.new(map, fn({k, v}) -> {to_string(k), v} end)
  end

  @doc """
  Sends hints for a set of letters to the client when they've
  been generated.
  """
  def handle_info({:send_hints, hints}, socket) do
    push(socket, "receive_hints", %{hints: hints})
    {:noreply, socket}
  end

  defp valid_move?(letter, socket) do
    true
  end
end
