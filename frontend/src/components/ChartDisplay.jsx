import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ChartDisplay({ data }) {
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("All");

  const years = Array.from(new Set(data.map((d) => d.year))).sort();
  const companies = Array.from(new Set(data.map((d) => d.company))).sort();

  const filtered = data.filter((d) => {
    return (
      (selectedYear === "All" || d.year === selectedYear) &&
      (selectedCompany === "All" || d.company === selectedCompany)
    );
  });

  const salesPerYear = Object.values(
    filtered.reduce((acc, row) => {
      acc[row.year] = acc[row.year] || { year: row.year, sales: 0 };
      acc[row.year].sales += 1;
      return acc;
    }, {})
  );

  const salesPerCompany = Object.values(
    filtered.reduce((acc, row) => {
      acc[row.company] = acc[row.company] || { company: row.company, sales: 0 };
      acc[row.company].sales += 1;
      return acc;
    }, {})
  );

  const truncate = (str, length = 6) =>
    str.length > length ? str.slice(0, length) : str;

  return (
    <div className="mt-6 text-white">
      <h2 className="text-2xl font-bold mb-4">📊 Sales Over Years</h2>

      <div className="mb-6 flex gap-6">
        <div>
          <label className="mr-2">Filter by Year:</label>
          <select
            className="text-black rounded px-2 py-1"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="All">All</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2">Filter by Company:</label>
          <select
            className="text-black rounded px-2 py-1"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="All">All</option>
            {companies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-gray-800 rounded-md shadow-md p-4 mb-10">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesPerYear}>
            <CartesianGrid stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="year"
              stroke="#aaa"
              label={{
                value: "Year",
                position: "insideBottom",
                offset: -5,
                fill: "#ccc",
              }}
            />
            <YAxis
              stroke="#aaa"
              label={{
                value: "Number of Sales",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                // dy: -40,
                style: { textAnchor: "middle", fill: "#ccc" },
              }}
            />
            <Legend verticalAlign="top" />
            <Tooltip
              contentStyle={{ backgroundColor: "#222", border: "none" }}
              labelStyle={{ color: "#fff" }}
              formatter={(value) => [`${value} sales`, ""]}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#00c3ff"
              strokeWidth={3}
              name="Sales per Year"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <h2 className="text-2xl font-bold mb-4">🧱 Sales by Company</h2>
      <div className="bg-gray-800 rounded-md shadow-md p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesPerCompany}>
            <CartesianGrid stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="company"
              angle={-45}
              textAnchor="end"
              height={100}
              tickFormatter={(name) => truncate(name)}
              stroke="#aaa"
            />
            <YAxis
              stroke="#aaa"
              label={{
                value: "Number of Sales",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                // dy: -40,
                style: { textAnchor: "middle", fill: "#ccc" },
              }}
            />
            <Legend verticalAlign="top" />
            <Tooltip
              contentStyle={{ backgroundColor: "#222", border: "none" }}
              labelStyle={{ color: "#fff" }}
              formatter={(value) => [`${value} sales`, ""]}
            />
            <Bar
              dataKey="sales"
              fill="#72d6ff"
              name="Sales by Company"
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
