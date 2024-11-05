
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files from 'public'

// Routes
const routes = require('./routes/routes');
app.use('/', routes);

// Server start
const port = process.env.PORT || 2000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

