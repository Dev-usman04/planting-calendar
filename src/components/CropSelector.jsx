import React from 'react';
import { motion } from 'framer-motion';

export default function CropSelector({ selectedCrop, setSelectedCrop, availableCrops }) {
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
        disabled={!availableCrops.length}
      >
        <option value="">-- Select a crop --</option>
        {availableCrops.map((crop) => (
          <option key={crop} value={crop}>
            {crop}
          </option>
        ))}
      </select>
      {!availableCrops.length && (
        <p className="text-gray-500 text-sm mt-1">Please select a country first.</p>
      )}
    </motion.div>
  );
}