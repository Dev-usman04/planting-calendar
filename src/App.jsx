import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import CropSelector from './components/CropSelector';
import CalendarView from './components/CalendarView';
import NotesSection from './components/NotesSection';
import RemindersPopup from './components/RemindersPopup';
import EmailAlertForm from './components/EmailAlertForm';
import RegistrationForm from './components/RegistrationForm';
import plantingSchedule from './data/plantingSchedule.json';
import './App.css';

// Replace with your EmailJS credentials
const EMAILJS_USER_ID = 'Pn6qAwr5qYbeuIaRB'; // From EmailJS dashboard > Account > Integrations

export default function App() {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [plantingData, setPlantingData] = useState(null);
  const [showReminders, setShowReminders] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [availableCrops, setAvailableCrops] = useState([]);
  const [registeredUser, setRegisteredUser] = useState(null);

  // Extract unique countries from plantingSchedule
  const countries = [...new Set(
    Object.keys(plantingSchedule).map(key => key.split('_')[0])
  )].map(country => country.charAt(0).toUpperCase() + country.slice(1));

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_USER_ID);
  }, []);

  // Load initial state from localStorage
  useEffect(() => {
    const storedCountry = localStorage.getItem('selectedCountry');
    const storedCrop = localStorage.getItem('selectedCrop');
    const storedReminders = localStorage.getItem('reminders');
    const storedAvailableCrops = localStorage.getItem('availableCrops');
    const storedUser = localStorage.getItem('registeredUser');

    if (storedCountry && countries.includes(storedCountry)) {
      setSelectedCountry(storedCountry);
    }
    if (storedCrop) {
      setSelectedCrop(storedCrop);
    }
    if (storedReminders) {
      try {
        setReminders(JSON.parse(storedReminders));
      } catch (err) {
        console.error('Failed to parse reminders from localStorage', err);
        setReminders([]);
      }
    }
    if (storedAvailableCrops) {
      try {
        setAvailableCrops(JSON.parse(storedAvailableCrops));
      } catch (err) {
        console.error('Failed to parse availableCrops from localStorage', err);
        setAvailableCrops([]);
      }
    }
    if (storedUser) {
      try {
        setRegisteredUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse registeredUser from localStorage', err);
        setRegisteredUser(null);
      }
    }
  }, []);

  // Handle geolocation
  useEffect(() => {
    const storedLocation = localStorage.getItem('location');
    if (storedLocation && countries.includes(storedLocation)) {
      setSelectedCountry(storedLocation);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await fetch(`https://geocode.xyz/${position.coords.latitude},${position.coords.longitude}?geoit=json`);
          const data = await res.json();
          if (data.country) {
            const country = data.country.charAt(0).toUpperCase() + data.country.slice(1).toLowerCase();
            if (countries.includes(country)) {
              setSelectedCountry(country);
              localStorage.setItem('location', country);
              localStorage.setItem('selectedCountry', country);
            }
          }
        } catch (error) {
          console.error('Geolocation error:', error);
        }
      });
    }
  }, []);

  // Update available crops when country changes
  useEffect(() => {
    if (selectedCountry) {
      const crops = [...new Set(
        Object.keys(plantingSchedule)
          .filter(key => key.startsWith(selectedCountry.toLowerCase() + '_'))
          .map(key => key.split('_')[1])
      )].map(crop => crop.charAt(0).toUpperCase() + crop.slice(1));
      setAvailableCrops(crops);
      localStorage.setItem('availableCrops', JSON.stringify(crops));
      setSelectedCrop(null); // Reset crop when country changes
      localStorage.setItem('selectedCrop', '');
      setPlantingData(null); // Reset planting data
    } else {
      setAvailableCrops([]);
      localStorage.setItem('availableCrops', JSON.stringify([]));
    }
    localStorage.setItem('selectedCountry', selectedCountry);
  }, [selectedCountry]);

  // Update planting data when crop and country are selected
  useEffect(() => {
    if (selectedCountry && selectedCrop) {
      const country = selectedCountry.toLowerCase();
      const crop = selectedCrop.toLowerCase();
      const key = `${country}_${crop}`;
      const cropData = plantingSchedule[key];
      setPlantingData(cropData || null);
      localStorage.setItem('selectedCrop', selectedCrop);
    }
  }, [selectedCrop, selectedCountry]);

  // Check for due reminders and send email alerts
  useEffect(() => {
    const checkReminders = () => {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      reminders.forEach((reminder) => {
        if (reminder.date === today && !reminder.sent) {
          const templateParams = {
            crop: reminder.crop,
            note: reminder.note,
            date: reminder.date,
            country: reminder.country,
            to_email: registeredUser?.email || 'YOUR_EMAIL_ADDRESS', // Use registered email if available
          };

          emailjs
            .send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then((response) => {
              console.log('Email sent successfully:', response.status, response.text);
              // Mark reminder as sent
              const updatedReminders = reminders.map((r) =>
                r.id === reminder.id ? { ...r, sent: true } : r
              );
              setReminders(updatedReminders);
              localStorage.setItem('reminders', JSON.stringify(updatedReminders));
            })
            .catch((error) => {
              console.error('Failed to send email:', error);
            });
        }
      });
    };

    // Check reminders every minute
    const interval = setInterval(checkReminders, 60 * 1000);
    checkReminders(); // Run immediately on mount

    return () => clearInterval(interval); // Cleanup on unmount
  }, [reminders, registeredUser]);

  const saveReminder = (note, date) => {
    if (!note || !date || !selectedCrop || !selectedCountry) return;
    const newReminder = {
      id: Date.now(),
      crop: selectedCrop,
      country: selectedCountry,
      note,
      date,
      remindLater: false,
      sent: false, // Initialize sent flag
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

        {!registeredUser && (
          <RegistrationForm setRegisteredUser={setRegisteredUser} />
        )}

        {registeredUser && (
          <>
            <div className="mb-4 text-center">
              <p className="text-gray-700">Welcome, {registeredUser.username}! (<a href="#" onClick={() => { setRegisteredUser(null); localStorage.removeItem('registeredUser'); }} className="text-blue-600 hover:underline">Logout</a>)</p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Select Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">-- Select a country --</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <CropSelector 
              selectedCrop={selectedCrop} 
              setSelectedCrop={setSelectedCrop} 
              availableCrops={availableCrops}
            />
            <CalendarView crop={selectedCrop} data={plantingData} />
            <NotesSection crop={selectedCrop} onSaveReminder={saveReminder} />
            <EmailAlertForm
              selectedCrop={selectedCrop}
              selectedCountry={selectedCountry}
              reminders={reminders}
              setReminders={setReminders}
              registeredEmail={registeredUser?.email}
            />
            <div className="text-center mt-6">
              <button
                onClick={() => setShowReminders(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
              >
                View Reminders
              </button>
            </div>
          </>
        )}

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