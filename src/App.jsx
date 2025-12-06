import React, { useState, useEffect } from "react";
import TornadoSimulation from "./TornadoSimulation";
import vehiclesData from "./vehicles.json";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function App() {
  const [vehicles, setVehicles] = useState([]);
  const [stormIntensity, setStormIntensity] = useState(100);
  const [predictedTornado, setPredictedTornado] = useState("Cone");

  useEffect(() => {
    setVehicles(vehiclesData.vehicles);
  }, []);

  const predictTornado = () => {
    const warehouseVehicles = vehicles.filter(v => v.category === "warehouse");
    const avgWind = warehouseVehicles.length
      ? warehouseVehicles.reduce((sum, v) => sum + (v.stats.wind_threshold_mph[0] + v.stats.wind_threshold_mph[1]) / 2, 0) / warehouseVehicles.length
      : 100;

    const wind = stormIntensity + Math.random() * 50;
    if (wind > avgWind) return "Cone";
    if (wind > avgWind / 1.5) return "Wedge";
    return "Rope";
  };

  useEffect(() => {
    setPredictedTornado(predictTornado());
  }, [stormIntensity, vehicles]);

  // Chart data
  const categoryCounts = vehicles.reduce((acc, v) => {
    acc[v.category] = (acc[v.category] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.keys(categoryCounts).map(key => ({
    category: key,
    count: categoryCounts[key]
  }));

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4 text-center">Twisted Dashboard</h1>

      <div className="mb-6">
        <label className="block mb-2">Storm Intensity: {stormIntensity}</label>
        <input
          type="range"
          min="0"
          max="300"
          value={stormIntensity}
          onChange={e => setStormIntensity(Number(e.target.value))}
          className="w-full"
        />
        <p className="mt-2 font-bold">Predicted Tornado: {predictedTornado}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Vehicle Thresholds</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-700">
            <thead>
              <tr>
                <th className="px-2 py-1 border border-gray-700">Name</th>
                <th className="px-2 py-1 border border-gray-700">Category</th>
                <th className="px-2 py-1 border border-gray-700">Speed (mph)</th>
                <th className="px-2 py-1 border border-gray-700">Wind Threshold (mph)</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, i) => (
                <tr key={i}>
                  <td className="px-2 py-1 border border-gray-700">{v.name}</td>
                  <td className="px-2 py-1 border border-gray-700">{v.category}</td>
                  <td className="px-2 py-1 border border-gray-700">{v.stats.speed_mph}</td>
                  <td className="px-2 py-1 border border-gray-700">{v.stats.wind_threshold_mph.join(" - ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-

