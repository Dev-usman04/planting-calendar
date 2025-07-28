// components/CropSelector.jsx
import React from 'react';
import { motion } from 'framer-motion';

const crops = ['Maize', 'Tomato', 'Rice', 'Wheat', 'Cassava'];

export default function CropSelector({ selectedCrop, setSelectedCrop }) {
  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <label className="block text-gray-700 mb-1">Select Crop</label>
      <select
        value={selectedCrop || ''}
        onChange={(e) => setSelectedCrop(e.target.value)}
        className="w-full p-2 border rounded-md"
      >
        <option value="">-- Select a crop --</option>
        {crops.map((crop) => (
          <option key={crop} value={crop}>
            {crop}
          </option>
        ))}
      </select>
    </motion.div>
  );
}
