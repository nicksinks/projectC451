const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db/connection');

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/appMain', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/appMain.html'));
});

router.get('/employees', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/employees.html'));
});

router.get('/doors', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/doors.html'));
});

router.get('/persons/list', (req, res) => {
        const query = 'SELECT * FROM persons';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ error: 'Failed to query database' });
            }
            res.json(results);  // Send the results as JSON
        });
    });

module.exports = router
;
