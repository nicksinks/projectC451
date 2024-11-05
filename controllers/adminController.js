//const db = require('../db/connection');

//exports.getEmployees = (req, res) => {
//    db.query('SELECT * FROM employees', (err, results) => {
//        if (err) throw err;
//        res.json(results);
//    });
//};

//exports.addEmployee = (req, res) => {
//    const { name, email, role } = req.body;
//    db.query('INSERT INTO employees (name, email, role) VALUES (?, ?, ?)', [name, email, role], (err) => {
//        if (err) throw err;
//        res.status(201).json({ message: 'Employee added' });
//    });
//};
