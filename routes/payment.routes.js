import { Router } from 'express';
const router = Router();
import {
	index,
	store,
	update,
	show,
	destroy,
} from '../controllers/payment.controller.js';
import upload from '../utils/multer.js';
import auth from '../middlewares/auth.js';

router.get('/', index);
router.get('/:id', show);
router.patch('/:id', auth.protect, upload.single('image'), update);
router.post('/', auth.protect, upload.single('image'), store);
router.delete('/:id', auth.protect, auth.restrictedTo('admin'), destroy);

export default router;
