const express = require('express');
const router = express.Router();
const path = require('path');

/*git comment added by me*/
//const adminController = require('../controllers/adminController');

// Routes for employee management
//router.get('/employees', adminController.getEmployees);
//router.post('/employees', adminController.addEmployee);

// Routes for secured doors
//router.get('/doors', adminController.getDoors);
//router.post('/doors', adminController.addDoor);

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

module.exports = router
;
