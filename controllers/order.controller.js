const Order = require('../models/order.model.js');
const factory = require('../utils/contollersFactory.js');
const AppError = require('../utils/appError.js');
const Email = require('../utils/email.js');
const { catchUnknownError } = require('../middlewares/catchUnknownError.js');
const index = factory.index(Order);
// const store = factory.store(Order);
const show = factory.show(Order);

const destroy = factory.destroy(Order);

const store = catchUnknownError(async (req, res, next) => {
	const created = await Order.create({
		...req.body,
	});

	const doc = await Order.findById(created._id).select('-__v').lean();

	// await new Email({ email: doc.email }).sendOrderDetails(doc);

	try {
		await new Email({ email: doc.email }).sendOrderPlaced(doc);
	} catch (error) {
		return next(
			new AppError(
				'There was an error sending the email, Please try again later!',
				500,
			),
		);
	}

	try {
		await new Email({
			email: process.env.EMAIL_USERNAME,
		}).sendOwnerOrderNotif();
	} catch (error) {
		return next(
			new AppError(
				'There was an error sending the email, Please try again later!',
				500,
			),
		);
	}

	res.status(200).json({
		status: 'success',
		data: doc,
	});
});

const update = catchUnknownError(async (req, res, next) => {
	const { paymentStatus, status, payments } = req.body;

	if (paymentStatus === 'paid' && !payments.length) {
		return next(new AppError('Please add payment transactions', 401));
	}

	// if there is another condition for fulfilled uncomment this
	// if (status === 'fulfilled') {
	// 	return next(new AppError('Please add delivered', 401));
	// }

	const doc = await Order.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!doc) {
		return next(new AppError('No document found with that ID', 404));
	}

	if (doc.paymentStatus === 'paid') {
		const isPaidEmailSent = await new Email({
			email: doc.email,
		}).sendOrderPlaced(doc);

		if (!isPaidEmailSent) {
			return next(
				new AppError(
					'There was an error sending the email, Please try again later!',
					500,
				),
			);
		}
	}

	if (doc.status === 'fulfilled') {
		console.log('Send order delivered');
	}

	res.status(200).json(doc);
});

const sendEmailOrderDetails = catchUnknownError(async (req, res, next) => {
	const id = req.params.id;

	const doc = await Order.findById(id).select('-__v').lean();

	if (!doc) {
		return next(new AppError('No document found with that ID', 404));
	}

	try {
		// await new Email({ email: doc.email }).sendOrderDetails(doc);
		await new Email({ email: doc.email }).sendOrderPlaced(doc);
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
});

module.exports = { index, store, show, destroy, update, sendEmailOrderDetails };
