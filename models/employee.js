const db = require('../db/connection');

const Employee = {
    getAll: (callback) => {
        db.query('SELECT * FROM employees', callback);
    },
    add: (name, email, role, callback) => {
        db.query('INSERT INTO employees (name, email, role) VALUES (?, ?, ?)', [name, email, role], callback);
    }
};

module.exports = Employee;
