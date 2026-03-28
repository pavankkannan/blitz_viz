import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const TOOLTIP_CONFIG = {
  cost: [
    {
      label: "Drafted By",
      render: d => d.drafted_by ?? "—",
    },
    {
      label: "Cost",
      render: d => `$${d.cost}`,
    },
    {
      label: "Pick",
      render: d =>
        d.pick_num && d.num_picks
          ? `${d.pick_num} / ${d.num_picks}`
          : "—",
    },
  ],

  result_order: [
    {
      label: "Used By",
      render: d => d.drafted_by ?? "—",
    },
    {
      label: "Wiped to",
      render: d =>
        d.result && d.result_order
          ? `${d.result} ${d.result_order}`
          : "—",
    },
    {
      label: "Placed",
      render: d =>
        d.placement && d.num_racers
          ? `${d.placement}/${d.num_racers}`
          : "—",
    },
  ],
};


function fillBlankRuns(data, totalRuns, valueKey) {
  const map = new Map(
    data.map(d => [d.run_number, d])
  );

  const result = [];

  for (let run = 1; run <= totalRuns; run++) {
    const row = map.get(run);

    result.push(
      row
        ? row
        : {
            run_number: run,
            [valueKey]: null,
          }
    );
  }
  return result;
}


function CustomTooltip({ active, payload, label, configKey }) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const rows = TOOLTIP_CONFIG[configKey];

  return (
    <div
      style={{
        background: "#232a23",
        border: "1px solid #3a4a3a",
        color: "#d4ddd4",
        padding: 10,
        fontSize: 12,
        minWidth: 160,
        borderRadius: 6,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6, color: "#e8f0e8" }}>
        Run {label}
      </div>

      {rows.map(({ label, render }) => (
        <div key={label}>
          <strong>{label}:</strong>{" "}
          {render(data)}
        </div>
      ))}
    </div>
  );
}



export default function Lines({ data, totalRuns, maxY, dataTypeY, ticks, yTickFormatter }) {
  const [isSmall, setIsSmall] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsSmall(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div style={{ width: "100%", height: "40vh" }}>
      <ResponsiveContainer>
        <LineChart data={fillBlankRuns(data, totalRuns, dataTypeY)} syncId={"run_number"} >
          <CartesianGrid strokeDasharray="8 3" stroke="#2e3d2e" />

          <XAxis
            dataKey="run_number"
            type="number"
            domain={[1, totalRuns]}
            padding={{left: 20, right: 20}}
            ticks={Array.from({ length: totalRuns }, (_, i) => i + 1).filter(n => n % 2 === 1)}
            interval={0}
            allowDataOverflow
            height={isSmall ? 30 : 50}
            tick={isSmall ? false : { fill: "#8a9a8a" }}
            label={{
              value: "Run Number",
              position: "insideBottom",
              offset: -5,
              fill: "#8a9a8a",
            }}
          />

          <YAxis
            domain={[0, maxY]}
            ticks={ticks}
            tick={{ fill: "#8a9a8a" }}
            tickFormatter={yTickFormatter}
            label={{
              value: dataTypeY,
              angle: -90,
              position: "insideLeft",
              fill: "#8a9a8a",
            }}
          />
          <Tooltip content={<CustomTooltip configKey={dataTypeY} />}/>


          <Line
            type="linear"
            dataKey={dataTypeY}
            strokeDasharray="6 6"
            stroke="#999"
            strokeWidth={1}
            activeDot={{ r: 8 }}
            connectNulls={true}
          />

          <Line
            type="linear"
            dataKey={dataTypeY}
            stroke="green"
            strokeWidth={2}
            dot={{ r: 4, fill: "green" }}
            activeDot={{ r: 8 }}
            connectNulls={false}
          />


        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
