defmodule WordsWithEnemies.GameChannel do
  @moduledoc """
  Contains callbacks that control the actual gameplay.
  """

  use WordsWithEnemies.Web, :channel
  import WordsWithEnemies.WordFinder, only: [word_list: 0, using: 2]
  alias WordsWithEnemies.{Letters, WordFinder, GameRegistry, GameServer, Hints}

  @doc """
  Connect to a standard single player game.
  """
  def join("games:ai", _payload, socket) do
    {:ok, socket}
  end

  @doc """
  Connect to an available multiplayer game from the lobby.
  """
  def join("games" <> game_id, %{"opponent" => %{"id" => _id, "name" => _name}}, socket) do
    {:ok, assign(socket, :game_id, game_id)}
  end

  @doc """
  Create a new multiplayer game and connect to it.
  """
  def join("games" <> game_id, %{"host" => %{"id" => _id, "name" => _name} = params}, socket) do
    send(self(), {:create_game, params})
    {:ok, assign(socket, :game_id, game_id)}
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

  @doc """
  Sends hints for a set of letters to the client when they've
  been generated.
  """
  def handle_info({:send_hints, hints}, socket) do
    push(socket, "receive_hints", %{hints: hints})
    {:noreply, socket}
  end

  @doc """
  Creates a new game, and alerts someone. Probably. I should
  look at this one again xD
  """
  def handle_info({:create_game, params}, socket) do
    game =
      %{host: %{name: params.name, id: params.id}}
      |> GameRegistry.add_game
      |> GameRegistry.get_pid
      |> GameServer.get_state

    broadcast_from(socket, "add_game", %{game: game})
    {:noreply, socket}
  end

  defp valid_move?(letter_id, socket) do
    pid = GameRegistry.get_pid(socket.assigns.id)
    # Return true if all the validations return true.
    with true <- GameServer.valid_letter?(pid, letter_id),
    do: true
  end
end
