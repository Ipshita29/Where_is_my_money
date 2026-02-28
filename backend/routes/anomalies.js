const express = require('express');
const router = express.Router();
const anomalyController = require('../controllers/anomalyController');
const authMiddleware = require('../utils/authMiddleware');

router.get('/', authMiddleware, anomalyController.listAnomalies);

module.exports = router;