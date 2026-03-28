import { useEffect, useState } from "react";
import { fetchPokemonData, fetchPokemonSummary, fetchRunCount } from "./api";
import Lines from "./components/Lines";
import SearchTable from "./components/SearchTable";
import "./Auction.css"




function Auction() {
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState("Oddish");
  const [totalRuns, setTotalRuns] = useState(null);
  const [tableVisible, setTableVisible] = useState(true);



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
    <div className="auction-page">
      {summary && (
        <div className={`table-container ${tableVisible ? '' : 'collapsed'}`}>
          <div className="table-header">
            <h2>Draftable Pokemon</h2>
            {tableVisible && (
              <button
                className="collapse-btn"
                onClick={() => setTableVisible(false)}
              >
                Hide Table
              </button>
            )}
          </div>
          <SearchTable
            data={summary}
            onSelect={pokemon => setSelectedPokemon(pokemon)}
          />
        </div>
      )}

      <div className="charts-container">
        <div className="charts-header">
          {!tableVisible && (
            <button
              className="collapse-btn"
              onClick={() => setTableVisible(true)}
            >
              Show Table
            </button>
          )}
          <h1>{selectedPokemon} Auction Data</h1>
        </div>

        {data && totalRuns && (
          <Lines
            data={data.cost_over_runs}
            totalRuns={totalRuns}
            maxY={7000}
            dataTypeY={"cost"}
            ticks={[2000,4000,6000]}
            yTickFormatter={v => v >= 1000 ? `$${v / 1000}k` : `$${v}`}
          />
        )}

        {data && totalRuns && (
          <Lines
            data={data.result_over_runs}
            totalRuns={totalRuns}
            maxY={14}
            dataTypeY={"result_order"}
            ticks={[2, 4, 6, 8, 10, 12, 14]}
          />
        )}
      </div>
    </div>
  );

}

export default Auction;
