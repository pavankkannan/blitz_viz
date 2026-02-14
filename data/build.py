import json
import duckdb
from pathlib import Path
from flask import jsonify

DATABASE = "data/database.db"

# Output directories (write to both)
OUTPUT_DIRS = [
    Path("client/blitz_viz/data"),
    Path("client/public/data"),
]

def get_con():
    return duckdb.connect(DATABASE, read_only=True)


def write_json_to_all_dirs(filename: str, data: dict, subfolder: str | None = None):
    """
    Write JSON to all configured output directories.
    If subfolder is provided, write inside that subfolder.
    """
    for base in OUTPUT_DIRS:
        target_dir = base / subfolder if subfolder else base
        target_dir.mkdir(parents=True, exist_ok=True)

        with (target_dir / filename).open("w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)


def updateDB():
    with duckdb.connect(DATABASE) as con:
        con.sql("""
            CREATE OR REPLACE TABLE auctions AS
            SELECT *
            FROM read_csv_auto('data/auctions_cleaned/*');
        """)

        con.sql("""
            ALTER TABLE auctions
            RENAME COLUMN "order" TO pick_num;
        """)

        con.sql("""
            CREATE OR REPLACE TABLE races AS
            SELECT *
            FROM read_csv_auto('data/race_results.csv');
        """)

        con.sql("""
            CREATE OR REPLACE TABLE draft_pool AS
            SELECT *
            FROM read_csv_auto('data/Pok.csv')
            WHERE stage='base' AND NOT name='Egg';
        """)


def updateAllPokemonJSON():
    ALL_POKEMON_QUERY = """
        SELECT name,
               COALESCE(FLOOR(AVG(cost)), 0) AS avg_cost,
               count(pokemon) AS times_appeared
        FROM draft_pool
        LEFT JOIN auctions ON draft_pool.name = auctions.pokemon
        GROUP BY name;
    """

    with get_con() as con:
        df = con.execute(ALL_POKEMON_QUERY).df()

    data = df.to_dict("records")
    write_json_to_all_dirs("all-pokemon.json", data)


def updatePokemonJSONs():
    POKEMON_GRAPH_QUERY = """
        SELECT pokemon, cost, drafted_by, pick_num, num_picks,
               run_number, result, result_order, placement,
               num_racers, auctions.run_id,
               FLOOR((pick_num - 1) / (num_picks / 2)) AS buckets_2,
               FLOOR((pick_num - 1) / (num_picks / 4)) AS buckets_4
        FROM auctions
        JOIN races
            ON auctions.run_id = races.run_id
           AND auctions.drafted_by = races.racer_name
        WHERE pokemon = ?
        ORDER BY auctions.run_id ASC;
    """

    with get_con() as con:
        pokemon_rows = con.execute(
            "SELECT name FROM draft_pool WHERE stage='base';"
        ).fetchall()

        for (pokemon_name,) in pokemon_rows:
            slug = pokemon_name.lower().replace(" ", "-")

            df = con.execute(
                POKEMON_GRAPH_QUERY,
                [pokemon_name]
            ).df()

            bundled = {
                "cost_over_runs": df[
                    ["run_number", "cost", "drafted_by",
                     "pick_num", "num_picks", "run_id"]
                ].to_dict("records"),

                "result_over_runs": df[
                    ["run_number", "result_order", "drafted_by",
                     "placement", "result", "num_racers"]
                ].to_dict("records"),

                "draft_buckets_2": df[
                    ["buckets_2", "cost"]
                ].to_dict("records"),

                "draft_buckets_4": df[
                    ["buckets_4", "cost"]
                ].to_dict("records"),
            }

            # Save inside pokemon/ subfolder
            write_json_to_all_dirs(
                f"{slug}.json",
                bundled,
                subfolder="pokemon"
            )

            print(f"Saved pokemon/{slug}.json")


def updateRunCount():
    TOTAL_RUNS_QUERY = """
        SELECT count(DISTINCT(run_id))
        FROM races;
    """

    with get_con() as con:
        df = con.execute(TOTAL_RUNS_QUERY).df()

    total_runs = int(df.iloc[0, 0])
    data = {"total_run_count": total_runs}

    write_json_to_all_dirs("total-run-count.json", data)

def build_all():
    print("Updating database...")
    updateDB()

    print("Building all_pokemon.json...")
    updateAllPokemonJSON()

    print("Building individual Pokémon JSONs...")
    updatePokemonJSONs()

    print("Building run_count.json...")
    updateRunCount()

    print("Build complete.")


if __name__ == "__main__":
    build_all()

