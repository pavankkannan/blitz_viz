# blitz_viz

Ongoing Statistics/Visualizations for Emerald Blitz Group

What is Emerald Blitz?

Folder Structure

raw_data: folder that houses the dashboard's database and CSVs for auctions, pokedex, race results

raw_data/database.db: Database that stores various tables (named different from CSV file names), queried and built with duckDB
raw_data/build.py: Script that updates, database, and writes to jsons for dashboard display
raw_data/auctions_cleaned: All auction CSVs that are currently in the databse, should all be in uniform format (see below)
raw_data/auctions_uncleaned: Any auction CSVs that are not yet in the database (usually not yet cleaned data)
raw_data/Pok.csv: List of Pokemon in the game, needs to be replaced periodically with most current version from main Emerald Blitz GitHub Repo
raw_data/race_results.csv: CSV that keeps track of run results (see below for more details on schema)

Database Schema:
auctions <- auctions_cleaned:
    Primary Key: run_id + pick_num
    Foreign Keys: 
        pokemon <-> draft_pool.name
        drafted_by <-> racer.racer_name
        run_id <-> racer.run_id

    pick_num: the order in which a pokemon in a given auction appeared (column is intially named order, then renamed in build.py due to "order" being a SQL keyword)
    pokemon: the name of the pokemon being auctioned off
    drafted_by: the name of the player who drafted the pokemon
    cost: How much the pokemon was sold for in the given auction
    run_id: The auction/race of which this pokemon appeared in



Cleaning Auction Files and Updating the Database: