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
   <ResponsiveContainer width="50%" height={450}>
      <LineChart data={data}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={true} 
        />

        <XAxis
          dataKey="pick"
          height={60}
          tick={({ x, y, payload }) => {
            const pick = payload.value;
            if (pick % 8 !== 0) return null;

            return (
              <text x={x} y={y + 15} textAnchor="middle" fill="#666">
                {pick}
              </text>
            );
          }}
          label={{ value: "Pick Number", position: "insideBottom", offset: -5 }}
        />

        <YAxis
          domain={[0, 20000]}
          tickFormatter={(value) => `$${value}`}
          label={{ value: "Money Remaining", angle: -90, position: "insideLeft" }}
        />

        <Tooltip formatter={(value) => `$${value}`} />
        <Legend />

        {racers.map((racer, index) => {
          const hue = Math.round((index / numRacers) * 360);
          const strokeColor = `hsl(${hue}, 70%, 50%)`;

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
