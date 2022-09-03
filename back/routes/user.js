const express = require('express');

const router = express.Router();

const loginSchema = require('../middlewares/validate-login');
const validateRequest = require('../middlewares/validate-request');
const userCtrl = require('../controllers/user');

router.post('/signup', loginSchema, validateRequest, userCtrl.signup);
router.post('/login', loginSchema, validateRequest , userCtrl.login);

module.exports = router;