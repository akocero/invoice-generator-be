const express = require('express');
const {
	index,
	store,
	update,
	show,
	destroy,
	updateQty,
} = require('../controllers/item.controller.js');
const auth = require('../middlewares/auth');

const router = express.Router();
const upload = require('../utils/multer.js');
const { catchUnknownError } = require('../middlewares/catchUnknownError');

router.get('/', index);
router.get('/:id', show);
router.patch('/:id', auth.protect, upload.single('image'), update);
router.post('/', auth.protect, upload.single('image'), store);
router.delete('/:id', auth.protect, auth.restrictedTo('admin'), destroy);
router.patch('/update_qty/:id', auth.protect, catchUnknownError(updateQty));

module.exports = router;
