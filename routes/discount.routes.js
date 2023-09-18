const express = require('express');
const {
	index,
	store,
	update,
	show,
	destroy,
	findByCode,
} = require('../controllers/discount.controller.js');
const auth = require('../middlewares/auth');
const guest = require('../middlewares/guest');

const router = express.Router();
const upload = require('../utils/multer.js');
const { catchUnknownError } = require('../middlewares/catchUnknownError.js');

router.get('/', auth.protect, index);
router.get('/findByCode/:code', catchUnknownError(findByCode));
router.get('/:id', auth.protect, show);
router.patch('/:id', auth.protect, upload.single('image'), update);
router.post('/', auth.protect, upload.single('image'), store);
router.delete('/:id', auth.protect, auth.restrictedTo('admin'), destroy);

module.exports = router;
