// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const dynamicRoutes = require('./routes/dynamicRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const LOCAL_MONGO_URI = process.env.LOCAL_MONGO_URI;

app.use(cors());
app.use(bodyParser.json());

// Register routes
app.use('/api/users', userRoutes);     // User-related routes
app.use('/api/dynamic', dynamicRoutes); // Dynamic schema and CRUD routes

// Start the local MongoDB connection
mongoose.connect(LOCAL_MONGO_URI)
  .then(() => console.log('Connected to local MongoDB'))
  .catch((err) => console.log('Local MongoDB connection error:', err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
