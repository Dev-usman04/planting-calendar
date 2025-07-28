import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

export default function RemindersPopup({ onClose, reminders, setReminders, allowDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editedNote, setEditedNote] = useState('');

  const handleDelete = (id) => {
    if (!allowDelete) {
      toast.error('Deletion is not allowed.');
      return;
    }

    const toastId = toast.info(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this reminder?</p>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                try {
                  // Ensure id is compared correctly (as a number)
                  const updatedReminders = reminders.filter((reminder) => Number(reminder.id) !== Number(id));
                  setReminders(updatedReminders);
                  localStorage.setItem('reminders', JSON.stringify(updatedReminders));
                  toast.dismiss(toastId);
                  toast.success('Reminder deleted successfully.');
                } catch (error) {
                  console.error('Error deleting reminder:', error);
                  toast.error('Failed to delete reminder. Please try again.');
                }
              }}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 px-3 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  const handleEdit = (id, currentNote) => {
    setEditingId(id);
    setEditedNote(currentNote);
  };

  const handleSaveEdit = (id) => {
    try {
      const updatedReminders = reminders.map((reminder) =>
        Number(reminder.id) === Number(id) ? { ...reminder, note: editedNote } : reminder
      );
      setReminders(updatedReminders);
      localStorage.setItem('reminders', JSON.stringify(updatedReminders));
      setEditingId(null);
      setEditedNote('');
      toast.success('Reminder updated successfully.');
    } catch (error) {
      console.error('Error saving edit:', error);
      toast.error('Failed to save edit. Please try again.');
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full relative"
        initial={{ scale: 0.8, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: -50 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4">🌾 Saved Crop Reminders</h2>

        {reminders.length === 0 ? (
          <p className="text-gray-600">No reminders found.</p>
        ) : (
          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {reminders.map(({ id, crop, note, country, date }) => (
              <li key={id} className="border p-3 rounded-md">
                {editingId === id ? (
                  <>
                    <input
                      type="text"
                      value={editedNote}
                      onChange={(e) => setEditedNote(e.target.value)}
                      className="w-full p-1 border rounded mb-2"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleSaveEdit(id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>{crop}</strong> ({country}, {date}) – {note}
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(id, note)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      {allowDelete && (
                        <button
                          onClick={() => handleDelete(id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg"
        >
          &times;
        </button>
      </motion.div>
    </motion.div>
  );
}