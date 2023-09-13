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
	orders,
	sendLoginCode,
	loginByCode,
	orderDetails,
	getWishList,
	updateWishList,
	removetWishList,
} = require('../controllers/guest.controller');
const guestAuth = require('../middlewares/guest');

const router = express.Router();
const { catchUnknownError } = require('../middlewares/catchUnknownError.js');

router.delete(
	'/deactivateMe',
	guestAuth.protect,
	catchUnknownError(deactivateMe),
);
router.patch('/updateMe', guestAuth.protect, catchUnknownError(updateMe));
router.patch(
	'/updatePassword',
	guestAuth.protect,
	catchUnknownError(updatePassword),
);
router.patch('/resetPassword/:token', catchUnknownError(resetPassword));

router.post('/forgotPassword', catchUnknownError(forgotPassword));
router.post('/register', catchUnknownError(register));
router.post('/login', catchUnknownError(login));
router.post('/loginEmail', catchUnknownError(sendLoginCode));
router.post('/loginCode', catchUnknownError(loginByCode));

router.get('/me', guestAuth.protect, me);
router.get('/orders', guestAuth.protect, catchUnknownError(orders));
router.get('/orders/:id', guestAuth.protect, catchUnknownError(orderDetails));
router.patch(
	'/update/wishlist',
	guestAuth.protect,
	catchUnknownError(updateWishList),
);
router.get('/wishlist', guestAuth.protect, catchUnknownError(getWishList));
router.delete(
	'/delete/wishlist/:id',
	guestAuth.protect,
	catchUnknownError(removetWishList),
);

module.exports = router;
