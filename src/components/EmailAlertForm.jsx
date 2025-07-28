import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';

// EmailJS credentials (passed as props to avoid hardcoding)
const EMAILJS_SERVICE_ID = 'service_9mf8vts';
const EMAILJS_TEMPLATE_ID = 'template_5nx7t24';

export default function EmailAlertForm({ selectedCrop, selectedCountry, reminders, setReminders, registeredEmail }) {
  const [email, setEmail] = useState('');
  const [selectedReminderId, setSelectedReminderId] = useState('');

  // Prefill email if registeredEmail is provided
  useEffect(() => {
    if (registeredEmail) {
      setEmail(registeredEmail);
    }
  }, [registeredEmail]);

  const handleSendEmail = () => {
    if (!email) {
      toast.error('Please enter an email address.');
      return;
    }

    // If a reminder is selected, send email for that reminder
    const selectedReminder = reminders.find((r) => Number(r.id) === Number(selectedReminderId));
    const templateParams = selectedReminder
      ? {
          crop: selectedReminder.crop,
          note: selectedReminder.note,
          date: selectedReminder.date,
          country: selectedReminder.country,
          to_email: email,
        }
      : {
          crop: selectedCrop || 'Test Crop',
          note: 'This is a test email from the Planting Calendar App.',
          date: new Date().toISOString().split('T')[0],
          country: selectedCountry || 'Test Country',
          to_email: email,
        };

    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then((response) => {
        console.log('Email sent successfully:', response.status, response.text);
        toast.success('Email sent successfully!');
        if (selectedReminder) {
          // Mark reminder as sent
          const updatedReminders = reminders.map((r) =>
            Number(r.id) === Number(selectedReminderId) ? { ...r, sent: true } : r
          );
          setReminders(updatedReminders);
          localStorage.setItem('reminders', JSON.stringify(updatedReminders));
        }
        setSelectedReminderId('');
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
        toast.error('Failed to send email. Please try again.');
      });
  };

  return (
    <motion.div
      className="mb-6 p-4 bg-gray-100 rounded-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-2 text-green-800">📧 Send Email Alert</h2>
      <div className="flex flex-col gap-3">
        <div>
          <label className="block text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Select Reminder (Optional)</label>
          <select
            value={selectedReminderId}
            onChange={(e) => setSelectedReminderId(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">-- Send Test Email --</option>
            {reminders.map((reminder) => (
              <option key={reminder.id} value={reminder.id}>
                {reminder.crop} ({reminder.country}, {reminder.date}) - {reminder.note}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSendEmail}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md"
        >
          Send Email
        </button>
      </div>
    </motion.div>
  );
}