import { useEffect, useState } from "react";
import { fetchLeaderboardData } from "./api";
import "./Leaderboard.css";

function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState({
        average_results: [],
        average_end_money: [],
        fastest_runs: [],
        mvps: [],
        most_wins: [],
    });

    useEffect(() => {
        fetchLeaderboardData()
        .then(res => setLeaderboardData(res))
        .catch(console.error);
    }, []);

    return (
        <div className="leaderboard-page">
            <h2>Leaderboard</h2>

            <h3>Average Wipes</h3>
            <table>
                <thead>
                    <tr>
                        <th>Racer Name</th>
                        <th>Avg Result</th>
                        <th>Number of Races</th>
                    </tr>
                </thead>
                <tbody>
                    {/* leaderboardData.average_results.map(...) */}
                    {leaderboardData.average_results.map((row, index) => (
                        <tr key={index}>
                            <td>{row.racer_name}</td>
                            <td>{row.average_result}</td>
                            <td>{row.number_of_races}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Top 10 Fastest Runs</h3>
            <table>
                <thead>
                    <tr>
                        <th>Racer Name</th>
                        <th>Time</th>
                        <th>Run</th>
                        <th>MVP</th>
                        <th>Run ID</th>
                    </tr>
                </thead>
                <tbody>
                    {/* leaderboardData.average_results.map(...) */}
                    {leaderboardData.fastest_runs.map((row, index) => (
                        <tr key={index}>
                            <td>{row.racer_name}</td>
                            <td>{row.time}</td>
                            <td>{row.run_number}</td>
                            <td>{row.mvp}</td>
                            <td>{row.run_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <h3>Most Wins</h3>
            <table>
                <thead>
                    <tr>
                        <th>Racer Name</th>
                        <th>Game Wins</th>
                        <th>Run Wins</th>
                    </tr>
                </thead>
                <tbody>
                    {/* leaderboardData.average_results.map(...) */}
                    {leaderboardData.most_wins.map((row, index) => (
                        <tr key={index}>
                            <td>{row.racer_name}</td>
                            <td>{row.game_wins}</td>
                            <td>{row.run_wins}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Top 10 MVPs</h3>
            <table>
                <thead>
                    <tr>
                        <th>Pokemon</th>
                        <th>KOs</th>
                        <th>Cost</th>
                        <th>Racer Name</th>
                        <th>Run Number</th>
                    </tr>
                </thead>
                <tbody>
                    {/* leaderboardData.average_results.map(...) */}
                    {leaderboardData.mvps.map((row, index) => (
                        <tr key={index}>
                            <td>{row.mvp}</td>
                            <td>{row.mvp_kos}</td>
                            <td>{row.cost}</td>
                            <td>{row.racer_name}</td>
                            <td>{row.run_number}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Average Post-Auction Money</h3>
            <table>
                <thead>
                    <tr>
                        <th>Racer Name</th>
                        <th>Avg End Money</th>
                        <th>Number of Races</th>
                    </tr>
                </thead>
                <tbody>
                    {/* leaderboardData.average_results.map(...) */}
                    {leaderboardData.average_end_money.map((row, index) => (
                        <tr key={index}>
                            <td>{row.racer_name}</td>
                            <td>{row.avg_end_money}</td>
                            <td>{row.number_of_races}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}
export default Leaderboard;