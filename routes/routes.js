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
        const { name, email, department, departmentID, secGroup } = req.body;
        const query = 'INSERT INTO persons (name, email, department, departmentID, secGroup) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [name, email, department, departmentID, secGroup], (err, results) => {
            if (err) {
                console.error('Error adding employee:', err);
                return res.status(500).json({ error: 'Failed to add employee' });
            }
            res.status(201).json({ message: 'Employee added successfully' });
        });
    });

router.get('/persons/:id', (req, res) => {
    const query = 'SELECT * FROM persons WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ error: 'Failed to query database' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(results[0]);
    });
});

router.get('/persons/delete/:id', (req, res) => {
    const query = 'DELETE FROM persons WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('Error deleting employee:', err);
            return res.status(500).json({ error: 'Failed to delete employee' });
        }
        res.json({ message: 'Employee deleted successfully' });
    });
});

module.exports = router
;
