const express = require('express');
const {
	index,
	store,
	update,
	show,
	destroy,
} = require('../controllers/image.controller.js');
const auth = require('../middlewares/auth');

const router = express.Router();
const upload = require('../utils/multer.js');

router.get('/', index);
router.get('/:id', show);
router.patch('/:id', auth.protect, upload.single('image'), update);
router.post('/', auth.protect, upload.single('file'), store);
router.delete('/:id', auth.protect, destroy);

module.exports = router;
