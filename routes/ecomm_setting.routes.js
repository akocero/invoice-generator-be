const express = require('express');
const {
	index,
	store,
	update,
	show,
	destroy,
	destroyImage,
} = require('../controllers/ecomm_setting.controller.js');
const auth = require('../middlewares/auth');

const router = express.Router();
const upload = require('../utils/multer.js');

router.get('/', index);
router.get('/:id', show);
router.patch('/:id', auth.protect, upload.single('image'), update);
router.post('/', auth.protect, upload.single('image'), store);
router.delete('/:id', auth.protect, auth.restrictedTo('admin'), destroy);
router.post('/deleteImage/:id', auth.protect, destroyImage);

module.exports = router;
