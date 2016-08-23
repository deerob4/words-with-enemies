defmodule WordsWithEnemies.WordView do
  use WordsWithEnemies.Web, :view

  def render("words.json", %{words: words}) do
    words
  end
end
