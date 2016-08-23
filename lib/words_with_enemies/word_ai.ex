defmodule WordsWithEnemies.WordAi do
  use GenServer
  alias WordsWithEnemies.{Letters}

  # Client

  @doc """
  Creates an instance of the AI, with a skill
  level of `difficulty`.
  """
  def start_link(id, difficulty) do
    GenServer.start_link(__MODULE__, %{id: id, difficulty: difficulty})
  end

  @doc """
  Returns the AI's difficulty.
  """
  def get_difficulty(pid) do
    GenServer.call(pid, :get_difficulty)
  end

  @doc """
  Sets the difficulty of the AI to `difficulty`.
  """
  def set_difficulty(pid, difficulty) do
    GenServer.cast(pid, {:set_difficulty, difficulty})
    IO.puts "red green"
  end

  @doc """
  Returns the AI's letters.
  """
  def get_letters(pid) do
    GenServer.call(pid, :get_letters)
  end

  @doc """
  Adds a new letter to the AI's letter bank.
  """
  def add_letter(pid) do
    GenServer.cast(pid, :add_letter)
  end

  @doc """
  Replaces the AI's current letters with a new set.
  """
  def new_letters(pid) do
    GenServer.cast(pid, :new_letters)
  end

  def make_word(pid, user_word) do
    GenServer.call(pid, {:make_word, user_word}, 10_000)
  end

  # Server

  def init(state) do
    letters = Letters.generate_ai_set(state.difficulty)
    state = Map.put(state, :letters, letters)
    {:ok, state}
  end

  def handle_call(:get_difficulty, _from, state) do
    {:reply, state.difficulty, state}
  end
  def handle_call(:get_letters, _from, state) do
    {:reply, state.letters, state}
  end
  def handle_call({:make_word, user_word}, _from, state) do
    inspect(user_word)
    word = 10
      # state.difficulty
      # |> find_words(state.letters, user_word)
      # |> choose_word(state.difficulty, user_word)

    {:reply, word, state}
  end

  def handle_cast(:add_letter, state) do
    new_letters = state.letters |> Letters.add_letter
    {:noreply, %{state | letters: new_letters}}
  end
  def handle_cast({:set_difficulty, difficulty}, state) do
    {:noreply, %{state | difficulty: difficulty}}
  end
  def handle_cast(:new_letters, state) do
    new_letters = Letters.generate_ai_set(state.difficulty)
    {:noreply, %{state | letters: new_letters}}
  end

  # Private

  def find_words("easy" = difficulty, letters, user_word) do
    words
    |> using(letters)
    |> between(min: 5, max: 6)
  end
  def find_words("medium" = difficulty, letters, user_word) do
    words
    |> using(letters)
    |> between(min: 7, max: 8)
    |> starting_with(user_word |> Letters.most_common)
  end
  def find_words("hard" = difficulty, letters, user_word) do
    prevailing_letter = user_word |> Letters.most_common
    words
    |> using(letters)
    |> between(min: 8)
    |> starting_with(prevailing_letter)
    |> containing(%{prevailing_letter: 2}, precise: false)
  end
end
