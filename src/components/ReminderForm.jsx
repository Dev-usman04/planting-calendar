import React, { useState } from "react";

export default function ReminderForm({ crop, reminders, setReminders }) {
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");

  const handleAddReminder = () => {
    if (note && date) {
      const newReminder = { crop, note, date };
      const updated = [...reminders, newReminder];
      setReminders(updated);
      localStorage.setItem("reminders", JSON.stringify(updated));
      setNote("");
      setDate("");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2 text-green-700">
        Add Reminder for {crop}:
      </h3>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="p-2 mr-2 rounded border"
      />
      <input
        type="text"
        placeholder="e.g. Water the crop"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="p-2 mr-2 rounded border"
      />
      <button
        onClick={handleAddReminder}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add
      </button>

      <ul className="mt-4">
        {reminders.filter((r) => r.crop === crop).map((r, i) => (
          <li key={i} className="bg-white p-2 my-2 shadow rounded">
            <strong>{r.date}</strong>: {r.note}
          </li>
        ))}
      </ul>
    </div>
  );
}