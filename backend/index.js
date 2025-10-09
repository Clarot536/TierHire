const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // To enable CORS
app.use(bodyParser.json()); // To parse JSON request bodies

// Dummy "database"
const users = [];

// POST route to handle the data from the React frontend
app.post('/user/register', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  // Simulate saving to a database (e.g., MongoDB, PostgreSQL, etc.)
  users.push({ name, email });

  // Respond with a success message and the saved data
  res.status(201).json({
    message: 'User data submitted successfully!',
    data: { name, email }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
