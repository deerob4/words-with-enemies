defmodule WordsWithEnemies.GameChannel do
  use WordsWithEnemies.Web, :channel
  import WordsWithEnemies.WordFinder, only: [word_list: 0, using: 2]
  alias WordsWithEnemies.{Letters, WordFinder, GameRegistry, GameServer, Hints}

  def join("games:ai", _payload, socket) do
    {:ok, socket}
  end
  def join("games" <> game_id, %{"opponent" => %{"id" => id, "name" => name}}, socket) do
    # game_id
    # |> GameRegistry.get_pid
    # |> GameServer.set_opponent()
    IO.puts name
    {:ok, assign(socket, :game_id, game_id)}
  end
  def join("games" <> game_id, %{"host" => %{"id" => id, "name" => name} = params}, socket) do
    send self, {:create_game, params}
    {:ok, assign(socket, :game_id, game_id)}
  end

  # def handle_info({:create_game, params}, socket) do
  #   game = %{host: %{name: name, id: id}}
  #          |> GameRegistry.add_game
  #          |> GameRegistry.get_pid
  #          |> GameServer.get_state

  #   broadcast_from(socket, "add_game", %{game: game})
  #   {:noreply, socket}
  # end

  def handle_in("games:start", %{"difficulty" => difficulty}, socket) do
    letters = Letters.generate_set(:player, difficulty)
    spawn(fn -> Hints.from_letters(letters, hint_strength(difficulty)) end)
    {:reply, {:ok, %{letters: letters, hints: []}}, socket}
  end

  def handle_in("games:add_letter", %{"letters" => letters}, socket) do
    new_letter = letters |> Letters.add_letter
    {:reply, {:ok, %{letter: new_letter}}, socket}
  end

  def handle_in("games:change_letters", %{"difficulty" => difficulty}, socket) do
    letters = Letters.generate_set(:player, difficulty)
    spawn(fn -> Hints.from_letters(letters, hint_strength(difficulty)) end)
    {:reply, {:ok, %{letters: letters, hints: []}}, socket}
  end

  def handle_in("games:check_validity", %{"word" => word}, socket) do
    valid? = word |> WordFinder.valid?
    {:reply, {:ok, %{valid: valid?}}, socket}
  end

  def handle_in("games:get_hint", %{"letters" => letters}, socket) do
    # hint =
  end

  def handle_in("games:get_words", %{"letters" => letters}, socket) do
    w = word_list()
        |> using(letters)
        |> Enum.to_list
        |> sort_by_length

    {:reply, {:ok, %{words: w}}, socket}
  end

  def handle_in("games:letter_to_word", %{"letter_id" => letter_id}, socket) do
    if valid_move?(letter_id, socket) do
      broadcast_from socket, "letter_to_word", %{letter_id: letter_id}
    end
    {:reply, :ok, socket}
  end

  def handle_in("games:letter_to_bank", %{"letter_id" => letter_id}, socket) do
    if valid_move?(letter_id, socket) do
      broadcast_from socket, "letter_to_bank", %{letter_id: letter_id}
    end
  end

  defp sort_by_length(list) when is_list(list) do
    list |> Enum.sort(&(String.length(&1) < String.length(&2)))
  end

  defp valid_move?(letter_id, socket) do
    pid = socket.assigns.id |> GameRegistry.get_pid

    # Return true if all the validations return true.
    with true <- GameServer.valid_letter?(pid, letter_id),
    do: true
  end

  defp hint_strength("easy"), do: [min: 5]
  defp hint_strength("medium"), do: [min: 4, max: 8]
  defp hint_strength("hard"), do: [min: 3, max: 5]
end
