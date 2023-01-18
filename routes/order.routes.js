import { Router } from 'express';
const router = Router();
import {
	index,
	store,
	update,
	show,
	destroy,
	sendEmailOrderDetails,
} from '../controllers/order.controller.js';
import upload from '../utils/multer.js';
import auth from '../middlewares/auth.js';
import { catchUnknownError } from '../middlewares/catchUnknownError.js';

router.get('/', index);
router.get(
	'/send_email_order_details/:id',
	catchUnknownError(sendEmailOrderDetails),
);
router.get('/:id', show);
router.patch('/:id', auth.protect, upload.single('image'), update);
router.post('/', upload.single('image'), store);
router.delete('/:id', auth.protect, auth.restrictedTo('admin'), destroy);

export default router;
