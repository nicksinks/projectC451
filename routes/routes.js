const express = require('express'); // Import the express library
const router = express.Router(); // Create a Router object
const path = require('path'); // Import the path module
const db = require('../db/connection'); // Import the connection object

// Define the routes
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
//get all employees by running a SQL select query
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
//add an employee by running a SQL insert query
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


//update an employee by running a SQL update query by ID
router.put('/persons/update/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, department, departmentID, secGroup } = req.body;
    const query = 'UPDATE persons SET name = ?, email = ?, department = ?, departmentID = ?, secGroup = ? WHERE id = ?';
    db.query(query, [name, email, department, departmentID, secGroup, id], (err, results) => {
        if (err) {
            console.error('Error updating employee:', err);
            return res.status(500).json({ error: 'Failed to update employee' });
        }
        res.json({ message: 'Employee updated successfully' });
    });
});


//get employee by ID for edit modal (or other application)
router.get('/persons/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM persons WHERE id = ?';
    db.query(query, [id], (err, results) => {
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

//use the delete statement from the edit modal
router.get('/persons/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM persons WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting employee:', err);
            return res.status(500).json({ error: 'Failed to delete employee' });
        }
        res.json({ message: 'Employee deleted successfully' });
    });
});
// Export the router object
module.exports = router;
