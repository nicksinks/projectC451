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
const twilioService = require('../services/twilioService');

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
    const { spotId, name, phoneNumber, notifyOnTimeout } = req.body;
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

        const spot = results[0];

        // Claim the spot with phone number and notification preferences
        const updateQuery = 'UPDATE spots SET is_occupied = TRUE, occupied_by = ?, occupied_at = NOW(), phone_number = ?, notify_on_timeout = ? WHERE id = ?';
        db.query(updateQuery, [name, phoneNumber || null, notifyOnTimeout || false, spotId], (err, results) => {
            if (err) {
                console.error('Error claiming spot:', err);
                return res.status(500).json({ error: 'Server error' });
            }

            // Send confirmation SMS if phone number provided
            if (phoneNumber) {
                twilioService.sendSpotClaimedNotification(phoneNumber, spot.name)
                    .catch(err => console.error('SMS send error:', err));
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

    // Get spot info before releasing
    const getSpotQuery = 'SELECT * FROM spots WHERE id = ?';
    db.query(getSpotQuery, [spotId], (err, spotResults) => {
        if (err) {
            console.error('Error fetching spot:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        const spot = spotResults[0];

        // Release the spot
        const releaseQuery = 'UPDATE spots SET is_occupied = FALSE, occupied_by = NULL, occupied_at = NULL, phone_number = NULL, notify_on_timeout = FALSE WHERE id = ?';
        db.query(releaseQuery, [spotId], (err, results) => {
            if (err) {
                console.error('Error releasing spot:', err);
                return res.status(500).json({ error: 'Server error' });
            }

            // Notify first person in queue if they want notifications
            const queueQuery = 'SELECT * FROM queue WHERE notify_on_available = TRUE ORDER BY joined_at ASC LIMIT 1';
            db.query(queueQuery, (err, queueResults) => {
                if (err) {
                    console.error('Error fetching queue:', err);
                } else if (queueResults.length > 0 && queueResults[0].phone_number) {
                    const queueMember = queueResults[0];
                    twilioService.sendSpotAvailableNotification(queueMember.phone_number, spot.name)
                        .catch(err => console.error('SMS send error:', err));
                }
            });

            res.json({ success: true });
        });
    });
});

// POST /spotsaver/queue - Join queue
router.post('/spotsaver/queue', (req, res) => {
    const { name, phoneNumber, notifyOnAvailable } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const query = 'INSERT INTO queue (name, phone_number, notify_on_available) VALUES (?, ?, ?)';
    db.query(query, [name, phoneNumber || null, notifyOnAvailable !== false], (err, results) => {
        if (err) {
            console.error('Error joining queue:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.json({ success: true, id: results.insertId });
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

// PUT /spotsaver/queue/:id/preferences - Update notification preferences
router.put('/spotsaver/queue/:id/preferences', (req, res) => {
    const { id } = req.params;
    const { notifyOnAvailable } = req.body;

    const query = 'UPDATE queue SET notify_on_available = ? WHERE id = ?';
    db.query(query, [notifyOnAvailable, id], (err, results) => {
        if (err) {
            console.error('Error updating preferences:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.json({ success: true });
    });
});

// POST /spotsaver/notifications/test - Test SMS notification
router.post('/spotsaver/notifications/test', async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    try {
        const result = await twilioService.sendTestNotification(phoneNumber);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;


