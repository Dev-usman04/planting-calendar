// App.jsx
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CropSelector from './components/CropSelector';
import CalendarView from './components/CalendarView';
import NotesSection from './components/NotesSection';
import RemindersPopup from './components/RemindersPopup';
import plantingSchedule from './data/plantingSchedule.json';
import './App.css';

export default function App() {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [location, setLocation] = useState('');
  const [plantingData, setPlantingData] = useState(null);
  const [manualCountry, setManualCountry] = useState('');
  const [showReminders, setShowReminders] = useState(false);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const storedLocation = localStorage.getItem('location');
    if (storedLocation) {
      setLocation(storedLocation);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          try {
            const res = await fetch(`https://geocode.xyz/${position.coords.latitude},${position.coords.longitude}?geoit=json`);
            const data = await res.json();
            if (data.country) {
              setLocation(data.country);
              localStorage.setItem('location', data.country);
            }
          } catch (error) {
            console.error("Geolocation error:", error);
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    if ((manualCountry || location) && selectedCrop) {
      const country = manualCountry || location;
      const crop = selectedCrop.toLowerCase();
      const key = `${country.toLowerCase()}_${crop}`;
      const cropData = plantingSchedule[key];
      setPlantingData(cropData || null);

      localStorage.setItem('preferredCrop', selectedCrop);
      localStorage.setItem('preferredCountry', country);
    }
  }, [selectedCrop, location, manualCountry]);

  useEffect(() => {
    const preferredCrop = localStorage.getItem('preferredCrop');
    const preferredCountry = localStorage.getItem('preferredCountry');
    if (preferredCrop) setSelectedCrop(preferredCrop);
    if (preferredCountry) setManualCountry(preferredCountry);
  }, []);

  useEffect(() => {
    const storedReminders = localStorage.getItem('reminders');
    if (storedReminders) {
      try {
        setReminders(JSON.parse(storedReminders));
      } catch (err) {
        console.error("Failed to parse reminders from localStorage", err);
        setReminders([]);
      }
    }
  }, []);

  const saveReminder = (note, date) => {
    if (!note || !date || !selectedCrop) return;
    const newReminder = {
      id: Date.now(),
      crop: selectedCrop,
      country: manualCountry || location,
      note,
      date,
      remindLater: false,
    };
    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));
  };

  return (
    <div className="app font-sans p-6 min-h-screen bg-green-50">
      <div className="container mx-auto max-w-3xl bg-white rounded-2xl shadow-2xl p-6">
        <motion.h1
          className="text-3xl font-bold mb-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🌱 Planting Calendar
        </motion.h1>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Manual Country Input (optional)</label>
          <input
            type="text"
            placeholder="e.g. Nigeria"
            value={manualCountry}
            onChange={(e) => setManualCountry(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <CropSelector selectedCrop={selectedCrop} setSelectedCrop={setSelectedCrop} />
        <CalendarView crop={selectedCrop} data={plantingData} />
        <NotesSection crop={selectedCrop} onSaveReminder={saveReminder} />

        <div className="text-center mt-6">
          <button
            onClick={() => setShowReminders(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
          >
            View Reminders
          </button>
        </div>

        <AnimatePresence>
          {showReminders && (
            <RemindersPopup 
              onClose={() => setShowReminders(false)} 
              allowDelete
              allowFutureAlert
              reminders={reminders}
              setReminders={setReminders}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
