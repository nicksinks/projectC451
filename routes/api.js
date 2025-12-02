const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /status - Get all spots and queue
router.get('/status', async (req, res) => {
    try {
        const [spots] = await pool.query('SELECT * FROM spots');
        const [queue] = await pool.query('SELECT * FROM queue ORDER BY joined_at ASC');
        res.json({ spots, queue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /claim - Claim a spot
router.post('/claim', async (req, res) => {
    const { spotId, name } = req.body;
    if (!spotId || !name) {
        return res.status(400).json({ error: 'Spot ID and name are required' });
    }

    try {
        // Check if spot is available
        const [rows] = await pool.query('SELECT * FROM spots WHERE id = ? AND is_occupied = FALSE', [spotId]);
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Spot is not available' });
        }

        await pool.query('UPDATE spots SET is_occupied = TRUE, occupied_by = ?, occupied_at = NOW() WHERE id = ?', [name, spotId]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /release - Release a spot
router.post('/release', async (req, res) => {
    const { spotId } = req.body;
    if (!spotId) {
        return res.status(400).json({ error: 'Spot ID is required' });
    }

    try {
        await pool.query('UPDATE spots SET is_occupied = FALSE, occupied_by = NULL, occupied_at = NULL WHERE id = ?', [spotId]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /queue - Join queue
router.post('/queue', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        await pool.query('INSERT INTO queue (name) VALUES (?)', [name]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /queue/:id - Leave queue
router.delete('/queue/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM queue WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
