const express = require('express');
const todoRoutes = require('./routes/todoRoutes.js');
require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/todos', todoRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;