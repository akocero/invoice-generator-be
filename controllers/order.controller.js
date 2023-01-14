import Order from '../models/order.model.js';
import factory from '../utils/contollersFactory.js';
import AppError from '../utils/appError.js';
import Email from '../utils/email.js';

const index = factory.index(Order);
// const store = factory.store(Order);
const show = factory.show(Order);
const update = factory.update(Order);
const destroy = factory.destroy(Order);
const store = factory.store(Order);

const sendEmailOrderDetails = async (req, res, next) => {
	const id = req.params.id;

	const doc = await Order.findById(id).select('-__v').lean();

	if (!doc) {
		return next(new AppError('No document found with that ID', 404));
	}

	try {
		await new Email({ email: doc.email }, 0).sendOrderDetails(doc);
	} catch (error) {
		console.log(error);
		return next(
			new AppError(
				'There was an error sending the email, Please try again later!',
				500,
			),
		);
	}

	res.status(200).json({
		status: 'success',
		message: 'Email Sent!',
	});
};

export { index, store, show, destroy, update, sendEmailOrderDetails };
