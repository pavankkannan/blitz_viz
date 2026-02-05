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
        background: "white",
        border: "1px solid #ccc",
        padding: 10,
        fontSize: 12,
        minWidth: 160,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>
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



export default function Lines({ data, totalRuns, maxY, dataTypeY, ticks }) {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={fillBlankRuns(data, totalRuns, dataTypeY)} syncId={"run_number"} >
          <CartesianGrid strokeDasharray="8 3" />

          <XAxis
            dataKey="run_number"
            type="number"
            domain={[1, totalRuns]}
            padding={{left: 20, right: 20}}
            ticks={Array.from({ length: totalRuns }, (_, i) => i + 1)}
            interval={0}
            allowDataOverflow
            label={{
              value: "Run Number",
              position: "insideBottom",
              // offset: -5
            }}
          />

          <YAxis 
            domain={[0, maxY]}
            ticks={ticks}
            label={{
              value: dataTypeY,
              angle: -90,
              position: "insideLeft",
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
            dot={{ r: 4, fill: "green"}}
            activeDot={{ r: 8 }}
            connectNulls={false}
          />


        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
