const express = require('express');
const { index } = require('../controllers/user.controller.js');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth.protect, auth.restrictedTo('admin'), index);

module.exports = router;
