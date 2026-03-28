import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

function DraftMoneyChart({ data }) {
  if (!data || data.length === 0) return null;

  const racers = Object.keys(data[0]).filter(key => key !== "pick");
  const numRacers = racers.length;

  return (
   <ResponsiveContainer width="100%" height={450}>
      <LineChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={true}
          stroke="#2e3d2e"
        />

        <XAxis
          dataKey="pick"
          height={60}
          tick={({ x, y, payload }) => {
            const pick = payload.value;
            if (pick % 8 !== 0) return null;

            return (
              <text x={x} y={y + 15} textAnchor="middle" fill="#8a9a8a">
                {pick}
              </text>
            );
          }}
          label={{ value: "Pick Number", position: "insideBottom", offset: -5, fill: "#8a9a8a" }}
        />

        <YAxis
          domain={[0, 20000]}
          tickFormatter={(value) => `$${value}`}
          tick={{ fill: "#8a9a8a" }}
          label={{ value: "Money Remaining", angle: -90, position: "insideLeft", fill: "#8a9a8a" }}
        />

        <Tooltip
          formatter={(value) => `$${value}`}
          contentStyle={{
            background: "#232a23",
            border: "1px solid #3a4a3a",
            color: "#d4ddd4",
            borderRadius: 6,
          }}
          labelStyle={{ color: "#e8f0e8" }}
          itemStyle={{ color: "#d4ddd4" }}
        />
        <Legend />

        {racers.map((racer, index) => {
          const hue = Math.round((index / numRacers) * 360);
          const strokeColor = `hsl(${hue}, 55%, 60%)`;

          return (
            <Line
              key={racer}
              type="monotone"
              dataKey={racer}
              stroke={strokeColor}
              strokeWidth={2}
              dot={false}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default DraftMoneyChart;
