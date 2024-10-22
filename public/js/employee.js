const db = require('../db/connection');

const Employee = {
    getAll: (callback) => {
        db.query('SELECT * FROM persons', callback);
    },
    add: (name, email, role, callback) => {
        db.query('INSERT INTO persons (name, email, department, departmentID, secGroup) VALUES (?, ?, ?, ?, ?)', [name, email, department, departmentID, secGroup], callback);
    }
};

module.exports = Employee;
