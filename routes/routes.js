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

    router.post('/persons/add', (req, res) => {
        const { name, email, role } = req.body;
        const query = 'INSERT INTO persons (name, email, role) VALUES (?, ?, ?)';
        db.query(query, [name, email, role], (err, results) => {
            if (err) {
                console.error('Error adding employee:', err);
                return res.status(500).json({ error: 'Failed to add employee' });
            }
            res.status(201).json({ message: 'Employee added successfully' });
        });
    });

module.exports = router
;
