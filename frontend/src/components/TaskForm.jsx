import { useState } from "react";
import axios from "axios";

export default function TaskForm({ onTaskCreated }) {
  const [source, setSource] = useState("A");
  const [startYear, setStartYear] = useState(2023);
  const [endYear, setEndYear] = useState(2025);
  const [filterCompany, setFilterCompany] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/tasks", {
        source,
        start_year: parseInt(startYear, 10),  // base 10 for safety
        end_year: parseInt(endYear, 10),
        filter_company: source === "B" ? filterCompany : undefined, 
      });
      onTaskCreated(response.data.task_id);
    } catch (error) {
      console.error(error);
      alert("Failed to create task!");
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-2">
        <label className="block">Source:</label>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="text-black px-2"
        >
          <option value="A">Source A (JSON)</option>
          <option value="B">Source B (CSV - Honda & Toyota only)</option>
          <option value="C">Source C (Live Car API)</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block">Year Range:</label>
        <input
          type="number"
          value={startYear}
          onChange={(e) => setStartYear(e.target.value)}
          className="text-black w-24 mr-2 px-2"
        />
        to
        <input
          type="number"
          value={endYear}
          onChange={(e) => setEndYear(e.target.value)}
          className="text-black w-24 ml-2 px-2"
        />
      </div>
      {source === "B" && (
        <div className="mb-2">
          <label className="block">Company (Honda or Toyota):</label>
          <input
            type="text"
            value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}
            className="text-black px-2"
          />
        </div>
      )}
      <button
        type="submit"
        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit Task
      </button>
    </form>
  );
}
