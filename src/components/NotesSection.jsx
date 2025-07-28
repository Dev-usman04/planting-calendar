// NotesSection.jsx
import React, { useState } from 'react';

export default function NotesSection({ crop, onSaveReminder }) {
  const [note, setNote] = useState('');
  const [reminderDate, setReminderDate] = useState('');

  const handleSave = () => {
    if (!note || !reminderDate) {
      alert('Please enter both a note and a date.');
      return;
    }

    onSaveReminder(note, reminderDate);
    setNote('');
    setReminderDate('');
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">📝 Notes & Reminders</h2>

      {crop ? (
        <>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={`Write a note for ${crop}...`}
            className="w-full p-3 border rounded-md mb-2"
            rows="4"
          />

          <div className="flex items-center gap-3 mb-4">
            <label className="text-gray-700">Reminder Date:</label>
            <input
              type="date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="p-2 border rounded-md"
            />
          </div>

          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md"
          >
            Save Reminder
          </button>
        </>
      ) : (
        <p className="text-gray-500 italic">Select a crop to add notes and reminders.</p>
      )}
    </div>
  );
}
