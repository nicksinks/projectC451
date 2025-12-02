-- SpotSaver Database Tables
-- This script creates the necessary tables for the SpotSaver parking management system

-- Create spots table
CREATE TABLE IF NOT EXISTS spots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    is_occupied BOOLEAN DEFAULT FALSE,
    occupied_by VARCHAR(100) DEFAULT NULL,
    occupied_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create queue table
CREATE TABLE IF NOT EXISTS queue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert initial spots (2 charging spots)
INSERT INTO spots (name, is_occupied) VALUES 
    ('Spot 1', FALSE),
    ('Spot 2', FALSE)
ON DUPLICATE KEY UPDATE name=name;

-- Optional: Create indexes for better performance
CREATE INDEX idx_is_occupied ON spots(is_occupied);
CREATE INDEX idx_joined_at ON queue(joined_at);
