const express = require('express');
const {
	index,
	store,
	update,
	show,
	destroy,
	sendEmailOrderDetails,
} = require('../controllers/order.controller.js');
const auth = require('../middlewares/auth');

const router = express.Router();
const upload = require('../utils/multer.js');
const { catchUnknownError } = require('../middlewares/catchUnknownError.js');

router.get('/', index);
router.get(
	'/send_email_order_details/:id',
	catchUnknownError(sendEmailOrderDetails),
);
router.get('/:id', show);
router.patch('/:id', auth.protect, upload.single('image'), update);
router.post('/', upload.single('image'), store);
router.delete('/:id', auth.protect, auth.restrictedTo('admin'), destroy);

module.exports = router;
