import { Router } from 'express';
const router = Router();
import {
	index,
	store,
	update,
	show,
	destroy,
	destroyImage,
	updateQty,
} from '../controllers/item.controller.js';
import upload from '../utils/multer.js';
import auth from '../middlewares/auth.js';
import { catchUnknownError } from '../middlewares/catchUnknownError.js';

router.get('/', index);
router.get('/:id', show);
router.patch('/:id', auth.protect, upload.single('image'), update);
router.post('/', auth.protect, upload.single('image'), store);
router.delete('/:id', auth.protect, auth.restrictedTo('admin'), destroy);
router.post('/deleteImage/:id', auth.protect, destroyImage);
router.patch('/update_qty/:id', auth.protect, catchUnknownError(updateQty));

export default router;
