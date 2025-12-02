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

router.get('/spotSaver', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/spotSaver.html'));
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


// Update the doors options in the select element
router.get('/doors/list', (req, res) => {
    const query = 'SELECT * FROM doors';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Failed to query database' });
        }
        res.json(results);  // Send the results as JSON
    });
});

router.get('/doors/:id', (req, res) => {    
    const { id } = req.params;
    const query = 'SELECT * FROM doors WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ error: 'Failed to query database' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Door not found' });
        }
        res.json(results[0]);
    });
});

router.post('/doors/add', (req, res) => {
    const { doorID, building, secGroup } = req.body;
    const query = 'INSERT INTO doors (doorID, building, secGroup) VALUES (?, ?, ?)';
    db.query(query, [doorID, building, secGroup], (err, results) => {
        if (err) {
            console.error('Error adding door:', err);
            return res.status(500).json({ error: 'Failed to add door' });
        }
        res.status(201).json({ message: 'Door added successfully' });
    });
});

router.post('/doors/update/:id', (req, res) => {
    const { id } = req.params;
    const { doorID, building, secGroup } = req.body;
    const query = 'UPDATE doors SET doorID = ?, building = ?, secGroup = ? WHERE id = ?';
    db.query(query, [doorID, building, secGroup, id], (err, results) => {
        if (err) {
            console.error('Error updating door:', err);
            return res.status(500).json({ error: 'Failed to update door' });
        }
        res.json({ message: 'Door updated successfully' });
    });
});

router.get('/doors/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM doors WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting door:', err);
            return res.status(500).json({ error: 'Failed to delete door' });
        }
        res.json({ message: 'Door deleted successfully' });
    });
});

router.get('/assist', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/chatAssistant.html'));
});

// ===== SpotSaver Routes =====

// GET /spotsaver/status - Get all spots and queue
router.get('/spotsaver/status', (req, res) => {
    const spotsQuery = 'SELECT * FROM spots';
    const queueQuery = 'SELECT * FROM queue ORDER BY joined_at ASC';
    
    db.query(spotsQuery, (err, spots) => {
        if (err) {
            console.error('Error fetching spots:', err);
            return res.status(500).json({ error: 'Failed to fetch spots' });
        }
        
        db.query(queueQuery, (err, queue) => {
            if (err) {
                console.error('Error fetching queue:', err);
                return res.status(500).json({ error: 'Failed to fetch queue' });
            }
            
            res.json({ spots, queue });
        });
    });
});

// POST /spotsaver/claim - Claim a spot
router.post('/spotsaver/claim', (req, res) => {
    const { spotId, name } = req.body;
    if (!spotId || !name) {
        return res.status(400).json({ error: 'Spot ID and name are required' });
    }

    // Check if spot is available
    const checkQuery = 'SELECT * FROM spots WHERE id = ? AND is_occupied = FALSE';
    db.query(checkQuery, [spotId], (err, results) => {
        if (err) {
            console.error('Error checking spot availability:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        
        if (results.length === 0) {
            return res.status(400).json({ error: 'Spot is not available' });
        }

        // Claim the spot
        const updateQuery = 'UPDATE spots SET is_occupied = TRUE, occupied_by = ?, occupied_at = NOW() WHERE id = ?';
        db.query(updateQuery, [name, spotId], (err, results) => {
            if (err) {
                console.error('Error claiming spot:', err);
                return res.status(500).json({ error: 'Server error' });
            }
            res.json({ success: true });
        });
    });
});

// POST /spotsaver/release - Release a spot
router.post('/spotsaver/release', (req, res) => {
    const { spotId } = req.body;
    if (!spotId) {
        return res.status(400).json({ error: 'Spot ID is required' });
    }

    const query = 'UPDATE spots SET is_occupied = FALSE, occupied_by = NULL, occupied_at = NULL WHERE id = ?';
    db.query(query, [spotId], (err, results) => {
        if (err) {
            console.error('Error releasing spot:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.json({ success: true });
    });
});

// POST /spotsaver/queue - Join queue
router.post('/spotsaver/queue', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const query = 'INSERT INTO queue (name) VALUES (?)';
    db.query(query, [name], (err, results) => {
        if (err) {
            console.error('Error joining queue:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.json({ success: true });
    });
});

// DELETE /spotsaver/queue/:id - Leave queue
router.delete('/spotsaver/queue/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM queue WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error leaving queue:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.json({ success: true });
    });
});

module.exports = router;

