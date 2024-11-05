const express = require('express');
const router = express.Router();
//const adminController = require('../controllers/adminController');

// Routes for employee management
//router.get('/employees', adminController.getEmployees);
//router.post('/employees', adminController.addEmployee);

// Routes for secured doors
//router.get('/doors', adminController.getDoors);
//router.post('/doors', adminController.addDoor);

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = router
;
