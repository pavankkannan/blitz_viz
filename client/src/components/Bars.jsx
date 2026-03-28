import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const TICK_ORDER = {
    result:  ["Roxanne", "Viola", "Brawly", "Wattson", "Flannery", "Norman", "Winona", "Tate & Liza", "Juan & Wallace", "Archie", "Maxie", "Sidney", "Spenser", "Lucy", "Phoebe", "Glacia", "Tucker", "Drake", "Brandon", "Steven", "Wally"],
    result_order: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
}

const COLOR_SET = {
    result:["#c8f0d8","#a0e0b8","#78d098","#50c078","#3aa862","#2d904e","#22783c","#18602c","#0e4820"],
    result_order: ["#B8A038", "#A8B820", "#C03028", "#F8D030", "#F08030", "#A8A77A", "#A890F0", "#F85888", "#6890F0", "#34568B", '#8B2D2D', "#705848", "#78C850", "#A040A0", "#705898", "#98D8D8", "#EE99AC", "#7038F8", "#E0C068", "#B8B8D0", "#4CAF50"]
}


function CustomTooltip({ active, payload, label, dataTypeX }) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;

  const EXCLUDE_KEYS = [dataTypeX, "result", "result_order"];

  const displayed = Object.keys(data)
    .filter((key) => !EXCLUDE_KEYS.includes(key) && data[key] !== 0)
    .map((key) => ({
      key,
      value: data[key],
    }))
    .reverse();

  const total = displayed.reduce((sum, d) => sum + d.value, 0);

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
        Wipes at {label}
      </div>

      {displayed.map(({ key, value }) => (
        <div key={key}>
          <strong>{key}:</strong> {value}
        </div>
      ))}

      <div style={{ fontWeight: 600, marginTop: 6, color: "#e8f0e8" }}>
        Total: {total}
      </div>
    </div>
  );
}

export default function Bars({ data, dataTypeX }) {

    const EXCLUDE_KEYS = [dataTypeX, "result", "result_order"];

    const stackKeys = Object.keys(data[0]).filter(
    (key) => !EXCLUDE_KEYS.includes(key)
    );

    if (dataTypeX === "result_order") {
      stackKeys.sort((a, b) => Number(a) - Number(b));
    }

    const sortedData = TICK_ORDER[dataTypeX]
    .map(name => data.find(d => d[dataTypeX] === name))
    .filter(Boolean);

    return (
    <ResponsiveContainer width="100%" height={550}>
        <BarChart data={sortedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2e3d2e" />
        <XAxis
            dataKey={dataTypeX}
            angle={-45}
            type="category"
            tick={{ fill: "#8a9a8a", fontSize: 12, textAnchor: "end" }}
            height={dataTypeX === "result" ? 120 : 80}
        />
        <YAxis tick={{ fill: "#8a9a8a" }} />
        <Legend />
        <Tooltip content={<CustomTooltip configKey={dataTypeX} />}/>
        {stackKeys.map((key, index) => (
            <Bar
            key={key}
            dataKey={key}
            stackId="a"
            fill={COLOR_SET[dataTypeX][Math.min(index, COLOR_SET[dataTypeX].length - 1)]}
            />
        ))}
        </BarChart>
    </ResponsiveContainer>
    );
}