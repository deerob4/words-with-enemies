defmodule Lists do
  use Benchfella

  @high_freq ["e", "t", "a", "o", "i", "n", "s", "h", "r", "d"]
  @med_freq ["l", "c", "u", "m", "w", "f", "g", "y", "p", "b"]
  @low_freq ["v", "k", "j", "x", "q", "z"]

  bench "append" do
    Enum.sort(@high_freq ++ @med_freq ++ @low_freq)
  end

  bench "concat" do
    [@high_freq, @med_freq, @low_freq]
    |> Enum.concat
    |> Enum.sort
  end

  bench "listception" do
    [@high_freq | [@med_freq | @low_freq]]
    |> List.flatten
    |> Enum.sort
  end

  bench "wee" do
    scanned = [10, 28, 2893, 28]
    tag = [10]

    scanned ++ tag
  end

  bench "wow" do
    scanned = [10, 28, 2893, 28]
    tag = 10

    [tag | scanned]
  end

  bench "wowee" do
    scanned = [10, 28, 2893, 28]
    tag = 10

    [scanned | tag]
  end
end
