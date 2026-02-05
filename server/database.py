import duckdb

DATABASE = "data/database.db"

def get_con():
    return duckdb.connect(DATABASE, read_only=True)

TOTAL_RUNS_QUERY = """
    SELECT count(DISTINCT(run_id))
    FROM races;
"""

ALL_POKEMON_QUERY = """
    SELECT name, COALESCE(FLOOR(AVG(cost)), 0) AS avg_cost, count(pokemon) AS times_appeared
    FROM draft_pool
    LEFT JOIN auctions ON draft_pool.name = auctions.pokemon
    GROUP BY name;
"""

POKEMON_GRAPH_QUERY = """
    SELECT pokemon, cost, drafted_by, pick_num, num_picks, run_number, result, result_order, placement, num_racers,  auctions.run_id, FLOOR((pick_num - 1) / (num_picks / 2)) AS buckets_2,  FLOOR((pick_num - 1) / (num_picks / 4)) AS buckets_4
    FROM auctions
    JOIN races on auctions.run_id = races.run_id and auctions.drafted_by=races.racer_name
    WHERE pokemon=?
    ORDER BY auctions.run_id ASC;
"""