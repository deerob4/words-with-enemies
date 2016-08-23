defmodule WordsWithEnemies.PageController do
  use WordsWithEnemies.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def user_id(conn, _params) do
    json conn, %{id: System.unique_integer([:positive])}
  end

  def redirect_to_menu(conn, _params) do
    redirect conn, to: "/"
  end
end
