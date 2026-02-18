import { useEffect, useState } from "react";
import { fetchDraft } from "./api";
import DraftMoneyChart from "./components/DraftMoneyChart";

function Draft() {
    const [draft, setDraft] = useState([]);

    useEffect(() => {
        const runId = "2026_02_15_r1";
        fetchDraft(runId)
            .then(res => setDraft(res))
            .catch(console.error);
    }, []);

    return (
        <>
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
