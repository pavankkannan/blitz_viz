import { useEffect, useState } from "react";
import { fetchBossData } from "./api";
import Bars from "./components/Bars";
import "./Boss.css"

function Boss() {
    const [bossData, setBossData] = useState(null);

    useEffect(() => {
        fetchBossData()
        .then(res => setBossData(res))
        .catch(console.error);
    }, []);

    return (
        <div className="Boss">
            <div className="bar-container">
                <h1>Wipes By Boss Battle</h1>
                {bossData && (
                    <Bars data={bossData.boss_data} dataTypeX={"result"}/>
                )}
            </div>
            <div className="bar-container">
                <h1>Wipes by Boss Order</h1>
                {bossData && (
                    <Bars data={bossData.order_data} dataTypeX={"result_order"}/>
                )}
            </div>

        </div>
    );
}
export default Boss;