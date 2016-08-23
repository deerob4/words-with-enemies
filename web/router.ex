defmodule WordsWithEnemies.Router do
  use WordsWithEnemies.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", WordsWithEnemies do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/lobby", PageController, :redirect_to_menu
    get "/game", PageController, :redirect_to_menu
  end

  scope "/api", WordsWithEnemies do
    pipe_through :api

    get "/find-words", WordController, :index
    get "/user-id", PageController, :user_id
  end
end
