const express = require('express');
const {
	index,
	store,
	update,
	show,
	destroy,
} = require('../controllers/customer.controller.js');
const auth = require('../middlewares/auth');

const router = express.Router();
const upload = require('../utils/multer.js');
// const { catchUnknownError } = require('../middlewares/catchUnknownError.js');

router.get('/', auth.protect, index);
router.get('/:id', auth.protect, show);
router.patch('/:id', auth.protect, upload.single('image'), update);
router.post('/', auth.protect, upload.single('image'), store);
router.delete('/:id', auth.protect, auth.restrictedTo('admin'), destroy);

module.exports = router;
