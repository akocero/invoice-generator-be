const express = require('express');
const {
	index,
	store,
	update,
	show,
	destroy,
} = require('../controllers/hero.controller.js');
const auth = require('../middlewares/auth');

const router = express.Router();
const upload = require('../utils/multer.js');

router.get('/', index);
router.get('/:id', show);
router.patch('/:id', auth.protect, update);
router.post('/', auth.protect, store);
router.delete('/:id', auth.protect, auth.restrictedTo('admin'), destroy);

module.exports = router;
