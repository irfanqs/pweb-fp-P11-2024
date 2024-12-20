const express = require('express');
const router = express.Router();
const { createReport } = require('../controllers/reportcontroller');

router.post('/save', createReport);

module.exports = router;
