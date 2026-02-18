import json
import duckdb
from pathlib import Path
from flask import jsonify

DATABASE = "raw_data/database.db"

# Output directories (write to both)
OUTPUT_DIRS = [
    Path("client/blitz_viz/data"),
    Path("client/public/data"),
]

def get_con():
    return duckdb.connect(DATABASE, read_only=True)


def write_json_to_all_dirs(filename: str, data: dict, subfolder: str | None = None):
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
            FROM read_csv_auto('raw_data/auctions_cleaned/*');
        """)

        con.sql("""
            ALTER TABLE auctions
            RENAME COLUMN "order" TO pick_num;
        """)

        con.sql("""
            CREATE OR REPLACE TABLE races AS
            SELECT *
            FROM read_csv_auto('raw_data/race_results.csv');
        """)

        con.sql("""
            CREATE OR REPLACE TABLE draft_pool AS
            SELECT *
            FROM read_csv_auto('raw_data/Pok.csv')
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


def buildDraftHistory():

    with get_con() as con:
        rows = con.execute(
            "SELECT DISTINCT(run_id) FROM races ORDER BY run_id ASC;"
        ).fetchall()
        drafts = [row[0] for row in rows]

    for draft in drafts:

        DRAFT_TIMELINE_QUERY = """
        SELECT pick_num, drafted_by, cost
        FROM auctions
        WHERE run_id = ?
        ORDER BY pick_num;
        """

        START_MONEY = 20000

        with get_con() as con:
            rows = con.execute(DRAFT_TIMELINE_QUERY, [draft]).fetchall()

        racers = sorted({row[1] for row in rows})
        money_left = {r: START_MONEY for r in racers}

        timeline = []

        row0 = {"pick": 0}
        for r in racers:
            row0[r] = START_MONEY
        timeline.append(row0)

        for pick_num, drafted_by, cost in rows:
            money_left[drafted_by] -= cost

            row = {"pick": pick_num}
            for r in racers:
                row[r] = money_left[r]

            timeline.append(row)

        write_json_to_all_dirs(
            f"{draft}.json",
            timeline,
            subfolder="drafts"
        )
        print(f"Saved draft/{draft}.json")






def build_all():
    print("Updating database...")
    updateDB()

    print("Building all-pokemon.json...")
    updateAllPokemonJSON()

    print("Building individual Pokémon JSONs...")
    updatePokemonJSONs()

    print("Building total-run-count.json...")
    updateRunCount()

    print("Building individual draft histories")
    buildDraftHistory()

    print("Build complete.")


if __name__ == "__main__":
    build_all()


    # print(buildDraftHistory())


