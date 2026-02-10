import json
from pathlib import Path
from database import get_con, POKEMON_GRAPH_QUERY, ALL_POKEMON_QUERY
from flask import Flask, request, jsonify

def slugify_pokemon_name(name: str) -> str:
    return name.lower().replace(" ", "-")

def pokemon_summary():
    with get_con() as con:
        df = con.execute(ALL_POKEMON_QUERY).df()

    return jsonify(df.to_dict("records"))

def main():
    server_dir = Path(__file__).resolve().parent
    output_dir = server_dir.parent / "client" / "blitz_viz" / "data"
    output_dir.mkdir(parents=True, exist_ok=True)

    with get_con() as con:
        df = con.execute(ALL_POKEMON_QUERY).df()

    output_path = output_dir / "all-pokemon.json"
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(df.to_dict("records"), f, indent=2)

    print(f"Saved {output_path}")

# def main():
#     con = get_con()
#     server_dir = Path(__file__).resolve().parent
#     output_dir = server_dir.parent / "client" / "blitz_viz" / "data" / "pokemon"


#     pokemon_rows = con.execute("SELECT name FROM draft_pool WHERE stage='base';").fetchall()

#     for row in pokemon_rows:
#         pokemon_name = row[0]  # DuckDB returns tuple rows
#         slug = slugify_pokemon_name(pokemon_name)

#         df = con.execute(
#             POKEMON_GRAPH_QUERY,
#             [pokemon_name]
#         ).df()

#         # Build the same bundle as your original API
#         bundled = {
#             "cost_over_runs": df[["run_number", "cost", "drafted_by", "pick_num", "num_picks", "run_id"]].to_dict("records"),
#             "result_over_runs": df[["run_number", "result_order", "drafted_by", "placement", "result", "num_racers"]].to_dict("records"),
#             "draft_buckets_2": df[["buckets_2", "cost"]].to_dict("records"),
#             "draft_buckets_4": df[["buckets_4", "cost"]].to_dict("records")
#         }

#         with (output_dir / f"{slug}.json").open("w", encoding="utf-8") as f:
#             json.dump(bundled, f, indent=2)

#         print(f"Saved {slug}.json")

#     con.close()

if __name__ == "__main__":
    main()
