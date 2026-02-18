export async function fetchPokemonData(pokemon) {
  let slug = pokemon.toLowerCase().replaceAll(".","").replaceAll(" ", "-")
  const res = await fetch(`./data/pokemon/${slug}.json`);
  // console.log(slug)
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

export async function fetchDraft(run_id) {
  const res = await fetch(`./data/drafts/${run_id}.json`);
  if (!res.ok) throw new Error("API error");
  return res.json();
}