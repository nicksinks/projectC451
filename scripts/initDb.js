const pool = require('../config/db');

async function initDb() {
    try {
        console.log('Initializing database...');

        // Create spots table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS spots (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                is_occupied BOOLEAN DEFAULT FALSE,
                occupied_by VARCHAR(255),
                occupied_at DATETIME
            )
        `);
        console.log('Spots table created or already exists.');

        // Create queue table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS queue (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Queue table created or already exists.');

        // Seed spots if empty
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM spots');
        if (rows[0].count === 0) {
            await pool.query(`
                INSERT INTO spots (name) VALUES ('Spot 1'), ('Spot 2')
            `);
            console.log('Seeded 2 spots.');
        } else {
            console.log('Spots already seeded.');
        }

        console.log('Database initialization complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initDb();
