const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../utils/authMiddleware');

router.get('/', authMiddleware, transactionController.listTransactions);
router.get('/summary', authMiddleware, transactionController.getSummary);

module.exports = router;