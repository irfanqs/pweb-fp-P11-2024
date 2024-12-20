const express = require('express');
const { login } = require('../controllers/authcontroller');
const { register } = require('../controllers/regisController');
const router = express.Router();

router.post('/login', login);
router.post('/insert-user', register);

module.exports = router;
