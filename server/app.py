from flask import Flask, request, jsonify
import pandas as pd

from database import get_con, POKEMON_GRAPH_QUERY, ALL_POKEMON_QUERY, TOTAL_RUNS_QUERY


app = Flask(__name__)

@app.route("/api/total-run-count", methods=["GET"])
def total_run_count():
    with get_con() as con:
        df = con.execute(TOTAL_RUNS_QUERY).df()

    total = int(df.iloc[0, 0])
    return {"total_run_count": total}

@app.route("/api/select", methods=["GET"])
def pokemon_data():

    pokemon = request.args.get("pokemon", "Porygon")

    with get_con() as con:
        df = con.execute(
            POKEMON_GRAPH_QUERY,
            [pokemon]
        ).df()

    return jsonify({
        "cost_over_runs": df[["run_number", "cost", "drafted_by", "pick_num", "num_picks", "run_id"]].to_dict("records"),
        "result_over_runs": df[["run_number", "result_order", "drafted_by", "placement", "result", "num_racers"]].to_dict("records"),
        "draft_buckets_2": df[["buckets_2", "cost"]].to_dict("records"),
        "draft_buckets_4": df[["buckets_4", "cost"]].to_dict("records")
    })

@app.route("/api/all-pokemon", methods=["GET"])
def pokemon_summary():
    with get_con() as con:
        df = con.execute(ALL_POKEMON_QUERY).df()

    return jsonify(df.to_dict("records"))


if __name__ == "__main__":
    app.run(debug=True, port=5000)

