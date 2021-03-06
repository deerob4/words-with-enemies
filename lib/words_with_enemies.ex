defmodule WordsWithEnemies do
  use Application

  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      # Start the endpoint when the application starts
      supervisor(WordsWithEnemies.Endpoint, []),
      supervisor(WordsWithEnemies.Presence, []),
      supervisor(WordsWithEnemies.Game.Supervisor, []),
      # worker(WordsWithEnemies.GameRegistry, []),
      worker(WordsWithEnemies.WordFinder, [])
      # Here you could define other workers and supervisors as children
      # worker(WordsWithEnemies.Worker, [arg1, arg2, arg3]),
    ]

    # See http://elixir-lang.org/docs/stable/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: WordsWithEnemies.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    WordsWithEnemies.Endpoint.config_change(changed, removed)
    :ok
  end
end
