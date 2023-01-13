import Order from '../models/order.model.js';
import factory from '../utils/contollersFactory.js';
import AppError from '../utils/appError.js';
import Email from '../utils/email.js';

const index = factory.index(Order);
// const store = factory.store(Order);
const show = factory.show(Order);
const update = factory.update(Order);
const destroy = factory.destroy(Order);

const store = async (req, res, next) => {
	const doc = await Order.create({
		...req.body,
	});
	// const doc = {
	// 	email: 'akocero15@gmail.com',
	// };

	try {
		await new Email({ email: doc.email }, 0).sendOrderDetails();
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
		// data: doc,
	});
};

export { index, store, show, destroy, update };
