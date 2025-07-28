import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

export default function RegistrationForm({ setRegisteredUser }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // Save user data to localStorage
    const user = { username, email, password };
    try {
      localStorage.setItem('registeredUser', JSON.stringify(user));
      setRegisteredUser(user);
      toast.success('Registration successful!');
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
      toast.error('Failed to register. Please try again.');
    }
  };

  return (
    <motion.div
      className="mb-6 p-4 bg-gray-100 rounded-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-2 text-green-800">📋 Register</h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        <div>
          <label className="block text-gray-700 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full p-2 border rounded-md"
          />
        </div>
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
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md"
        >
          Register
        </button>
      </form>
    </motion.div>
  );
}