export async function fetchPokemonData(pokemon, bucket) {
  const res = await fetch(`./data/pokemon/${pokemon.toLowerCase()}.json`);
  if (!res.ok) throw new Error("API error");
  return res.json();
}

export async function fetchPokemonSummary() {
  const res = await fetch(`./data/all-pokemon.json`);
  if (!res.ok) throw new Error("API error");
  return res.json();
}

export async function fetchRunCount() {
  const res = await fetch(`./data/total-run-count.json`);
  if (!res.ok) throw new Error("API error");
  return res.json();
}