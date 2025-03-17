const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/auth/status', (req, res) => {
  res.json({
    isAuthenticated: false,
    user: null,
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = 1234;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 