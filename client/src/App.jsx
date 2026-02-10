import { useEffect, useState } from "react";
import { fetchPokemonData, fetchPokemonSummary, fetchRunCount } from "./api";
import Lines from "./components/Lines";
import SearchTable from "./components/SearchTable";
import "./App.css"




function App() {
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState("Oddish");
  const [totalRuns, setTotalRuns] = useState(null);




  useEffect(() => {
    fetchPokemonData(selectedPokemon)
      .then(res => setData(res))
      .catch(console.error);
  }, [selectedPokemon]);

  useEffect(() => {
  fetchPokemonSummary()
    .then(res => setSummary(res))
    .catch(console.error);
  }, []);

  useEffect(() => {
    fetchRunCount()
      .then(res => {
        setTotalRuns(res.total_run_count);
      })
      .catch(console.error);
  }, []);



  // console.log("SUMMARY DATA:", summary);
  return (
    <div className="app">
      {summary && (
        <div className="table-container">
          <h2>Emerald Blitz Pokemon</h2>
          <SearchTable
            data={summary}
            onSelect={pokemon => setSelectedPokemon(pokemon)}
          />
        </div>
      )}

      <div className="charts-container">
        <h1>{selectedPokemon} Auction Data</h1>

        {data && totalRuns && (
          <Lines
            data={data.cost_over_runs}
            totalRuns={totalRuns}
            maxY={8000}
            dataTypeY={"cost"}
            ticks={[2000,4000,6000,8000]}

          />
        )}

        {data && totalRuns && (
          <Lines
            data={data.result_over_runs}
            totalRuns={totalRuns}
            maxY={14}
            dataTypeY={"result_order"}
            ticks={Array.from({ length: 14 }, (_, i) => i + 1)}

          />
        )}
      </div>
    </div>
  );

}

export default App;
