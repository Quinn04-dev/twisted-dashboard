import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const colors = { Cone: "#f59e0b", Wedge: "#ef4444", Rope: "#3b82f6" };

export default function TornadoSimulation({ stormIntensity, vehicles }) {
  const [tornadoes, setTornadoes] = useState([]);

  const getTornadoType = () => {
    const warehouseVehicles = vehicles.filter(v => v.category === "warehouse" && v.stats?.wind_threshold_mph);
    const avgWind = warehouseVehicles.length
      ? warehouseVehicles.reduce((sum, v) => sum + (v.stats.wind_threshold_mph[0] + v.stats.wind_threshold_mph[1])/2, 0) / warehouseVehicles.length
      : 100;

    const wind = stormIntensity + Math.random() * 50;
    if (wind > avgWind) return "Cone Tornado";
    if (wind > avgWind / 1.5) return "Wedge Tornado";
    return "Rope Tornado";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const type = getTornadoType();
      const x = Math.random() * 80 + 10;
      const y = Math.random() * 60 + 10;
      setTornadoes(prev => [...prev, { id: Date.now(), type, x, y }]);
      setTornadoes(prev => prev.slice(-20));
    }, 1500);
    return () => clearInterval(interval);
  }, [stormIntensity, vehicles]);

  return (
    <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden mb-12">
      {tornadoes.map(t => (
        <motion.div
          key={t.id}
          className="absolute w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: colors[t.type.split(" ")[0]], left: `${t.x}%`, top: `${t.y}%` }}
          animate={{ y: ["0%", "80%", "0%"], rotate: [0, 360] }}
          transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, ease: "linear" }}
        >
          {t.type.split(" ")[0]}
        </motion.div>
      ))}
    </div>
  );
}
