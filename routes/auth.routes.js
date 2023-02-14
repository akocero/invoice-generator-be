const express = require('express');
const {
	register,
	login,
	me,
	forgotPassword,
	resetPassword,
	updatePassword,
	updateMe,
	deactivateMe,
} = require('../controllers/auth.controller');
const auth = require('../middlewares/auth');

const router = express.Router();
const { catchUnknownError } = require('../middlewares/catchUnknownError.js');

router.delete('/deactivateMe', auth.protect, catchUnknownError(deactivateMe));
router.patch('/updateMe', auth.protect, catchUnknownError(updateMe));
router.patch(
	'/updatePassword',
	auth.protect,
	catchUnknownError(updatePassword),
);
router.patch('/resetPassword/:token', catchUnknownError(resetPassword));

router.post('/forgotPassword', catchUnknownError(forgotPassword));
router.post('/register', catchUnknownError(register));
router.post('/login', catchUnknownError(login));

router.get('/me', auth.protect, me);

module.exports = router;
