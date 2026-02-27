import { useEffect, useState } from "react";
import { fetchDraft } from "./api";
import DraftMoneyChart from "./components/DraftMoneyChart";

function Draft() {
    const [runId, setRunId] = useState("2026_02_15_r1");
    const [draft, setDraft] = useState([]);

    useEffect(() => {
        fetchDraft(runId)
            .then(res => setDraft(res))
            .catch(console.error);
    }, [runId]);

    const draftOptions = [
        "2026_01_05_r1",
        "2026_01_08_r1",
        "2026_01_11_r1",
        "2026_01_19_r1",
        "2026_01_23_r1",
        "2026_01_23_r2",
        "2026_01_24_r1",
        "2026_01_25_r1",
        "2026_01_27_r1",
        "2026_01_28_r1",
        "2026_01_29_r1",
        "2026_01_29_r2",
        "2026_01_30_r1",
        "2026_01_30_r2",
        "2026_01_31_r1",
        "2026_02_09_r1",
        "2026_02_15_r1",
        "2026_02_16_r1",
        "2026_02_17_r1",
        "2026_02_21_r1",
        "2026_02_22_r1",
        "2026_02_26_r1",
    ];

    return (

        // bar chart showing number of racers in runs (count(runs) vs num_racers)

        // dropdown menu to choose a specific draft
        // fast stats (number of picks, number of racers, average mon cost)


        // pie chart of type distributions
        // eventually add: pie chart of tier distributions
        // bar chart showing biggest under/overpays of the draft
        <>
            <div>
                <select
                    value={runId}
                    onChange={(e) => setRunId(e.target.value)}
                >
                    {draftOptions.map(id => {
                        const [year, month, day, run] = id.split("_");
                        const formatted = `${month}/${day}/${year.slice(2)} - Run ${run.slice(1)}`;

                        return (
                            <option key={id} value={id}>
                                {formatted}
                            </option>
                        );
                    })}
                </select>
            </div>

            {draft && (
                <>
                <h1>Draft Money Over Time</h1>
                <DraftMoneyChart data={draft} />
                </>
            )}
        </>
    );
}

export default Draft;