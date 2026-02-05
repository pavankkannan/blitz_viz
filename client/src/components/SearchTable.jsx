import { useState } from "react";
import "../component_styles/SearchTable.css";

export default function SearchTable({ data, onSelect }) {
  const [sortKey, setSortKey] = useState("avg_cost");
  const [direction, setDirection] = useState("desc");

  function sortBy(key) {
    if (key === sortKey) {
      setDirection(dir => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDirection("desc");
    }
  }

  const sorted = [...data].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];

    if (valA === valB) return 0;
    if (direction === "asc") return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  return (
    <div className="search-table-wrapper">
      <table className="search-table">
        <thead>
          <tr>
            <Header
              label="Pokémon"
              sortKey="name"
              sortBy={sortBy}
              activeKey={sortKey}
              direction={direction}
            />
            <Header
              label="Avg Cost"
              sortKey="avg_cost"
              sortBy={sortBy}
              activeKey={sortKey}
              direction={direction}
            />
            <Header
              label="Drafts"
              sortKey="times_appeared"
              sortBy={sortBy}
              activeKey={sortKey}
              direction={direction}
            />
          </tr>
        </thead>

        <tbody>
          {sorted.map(row => (
            <tr
              key={row.name}
              onClick={() => onSelect(row.name)}
              style={{ cursor: "pointer" }}
            >
              <td>{row.name}</td>
              <td>{row.avg_cost}</td>
              <td>{row.times_appeared}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
}

function Header({ label, sortKey, sortBy, activeKey, direction }) {
  const isActive = sortKey === activeKey;

  return (
    <th
      onClick={() => sortBy(sortKey)}
      style={{
        cursor: "pointer",
        padding: 8,
        userSelect: "none",
      }}
    >
      <span className="header-label">{label}</span>
      {/* Arrow container always exists */}
      <span className="sort-indicator">
        {isActive ? (direction === "asc" ? "▲" : "▼") : ""}
      </span>
    </th>
  );
}

