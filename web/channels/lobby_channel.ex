defmodule WordsWithEnemies.LobbyChannel do
  use WordsWithEnemies.Web, :channel
  alias WordsWithEnemies.{Presence, GameRegistry, GameServer}

  def join("games:lobby", _payload, socket) do
    send self, :after_join
    {:ok, socket}
  end

  def handle_info(:after_join, socket) do
    id = socket.assigns.user_id
    push socket, "presence_state", Presence.list(socket)
    Presence.track(socket, id, %{status: "available"})

    {:noreply, socket}
  end

  def handle_in("games:fetch", _params, socket) do
    games = GameRegistry.list
            |> Map.values
            |> Enum.map(&GameServer.get_state/1)

    {:reply, {:ok, %{games: games}}, socket}
  end

  def handle_in("games:create", %{"host_name" => name, "host_id" => id}, socket) do
    game = %{host: %{name: name, id: id}}
           |> GameRegistry.add_game
           |> GameRegistry.get_pid
           |> GameServer.get_state

    broadcast_from(socket, "add_game", %{game: game})

    {:reply, {:ok, %{id: game.id}}, socket}
  end

  def handle_in("games:delete", %{"id" => id}, socket) do
    GameRegistry.delete_game(id)
    broadcast_from(socket, "remove_game", %{id: id})

    {:reply, :ok, socket}
  end
end
