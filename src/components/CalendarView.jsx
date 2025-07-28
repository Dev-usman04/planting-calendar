// components/CalendarView.jsx
import React from 'react';
import { motion } from 'framer-motion';

export default function CalendarView({ crop, data }) {
  if (!crop) return null;

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-2 text-green-800">
        Planting Calendar for {crop}
      </h2>
      {!data ? (
        <p className="text-gray-600">No data available for this crop and location.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(data).map(([month, status]) => (
            <div
              key={month}
              className={`p-2 rounded text-center ${
                status === 'plant' ? 'bg-green-200' : status === 'harvest' ? 'bg-yellow-200' : 'bg-gray-100'
              }`}
            >
              <p className="font-semibold">{month}</p>
              <p className="text-sm capitalize">{status}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
