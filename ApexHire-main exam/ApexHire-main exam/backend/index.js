import express from 'express';
import dotenv from 'dotenv';
import { app } from './app.js';


dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
   

  

  } catch (err) {
    console.error('❌ Failed to connect to DB:', err);
    process.exit(1); // exit process if DB connection fails
  }
};

startServer();

// Optional: handle server errors
app.on('error', (err) => {
  console.error('Server error:', err);
});
