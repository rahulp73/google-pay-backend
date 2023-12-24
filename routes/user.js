const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

router.post('/login', UserController.login);
router.post('/transfer', UserController.transfer);
router.get('/transactions/:phoneNum', UserController.getUserTransactions);

module.exports = router;
