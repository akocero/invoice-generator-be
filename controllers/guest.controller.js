const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Customer = require('../models/customer.model');
const Order = require('../models/order.model');
const AppError = require('../utils/appError');
const Email = require('../utils/email.js');
const crypto = require('crypto');

const createToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_GUEST_SECRET, {
		expiresIn: process.env.JWT_GUEST_EXPIRES_IN,
	});
};

const createAndSendToken = (customer, req, res) => {
	const token = createToken(customer._id);

	res.cookie('jwt', token, {
		expires: new Date(
			Date.now() +
				process.env.JWT_GUEST_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
		),
		httpOnly: true,
		secure: false,
		//   secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
	});

	return token;
};

const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

const forgotPassword = async (req, res, next) => {
	const customer = await Customer.findOne({ email: req.body.email });

	if (!customer) {
		return next(new AppError('This email is not exist', 404));
	}
	// populate to customer passwordResetToken and PasswordResetTokenExpires
	const resetToken = customer.createPasswordResetToken();

	// saving customer details without validation
	await customer.save({ validateBeforeSave: false });

	// this is for same server request
	// const resetURL = `${req.protocol}://${req.get(
	// 	'host',
	// )}/api/v1/auth/resetPassword/${resetToken}`;

	// req.headers.origin it will work only at system request not on postman
	const resetURL = `${req.headers.origin}/auth/reset_password/${resetToken}`;

	try {
		await new Email(
			{ email: customer.email },
			resetURL,
		).sendPasswordReset();

		res.status(200).json({
			status: 'success',
			message: 'Token sent to your email!',
		});
	} catch (err) {
		customer.passwordResetToken = undefined;
		customer.passwordResetExpires = undefined;

		await customer.save({ validateBeforeSave: false });

		return next(
			new AppError(
				'There was an error sending the email, Please try again later!',
				500,
			),
		);
	}
};

const deactivateMe = async (req, res, next) => {
	await Customer.findByIdAndUpdate(req.customer.id, { active: false });

	res.status(204).json({
		status: 'success',
		data: null,
	});
};

const updateMe = async (req, res, next) => {
	if (req.body.password || req.body.passwordConfirm) {
		return next(
			new AppError(
				'You added forbidden field, The admin will contact you!',
				400,
			),
		);
	}

	const filteredBody = filterObj(
		req.body,
		'firstName',
		'lastName',
		'mobileNumber',
		'email',
		'city',
		'streetAddress',
		'state',
		'zipCode',
	);
	// if (req.file) filteredBody.photo = req.file.filename; for photos

	const updatedUser = await Customer.findByIdAndUpdate(
		req.customer.id,
		filteredBody,
		{
			new: true,
			runValidators: true,
		},
	);

	res.status(200).json({
		status: 'success',
		data: updatedUser,
	});
};

const resetPassword = async (req, res, next) => {
	const { password, passwordConfirm } = req.body;

	if (!password || !passwordConfirm) {
		return next(new AppError('Invalid Inputs!', 400));
	}

	const hashedToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	const customer = await Customer.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	if (!customer) {
		return next(
			new AppError('Token is invalid or expired, Please try again!', 400),
		);
	}

	if (!req.body.password) {
		return next(new AppError('Please provide a new password!', 400));
	}

	customer.password = password;
	customer.passwordConfirm = passwordConfirm;
	customer.passwordResetToken = undefined;
	customer.passwordResetExpires = undefined;

	await customer.save();

	res.status(200).json({
		status: 'success',
		message: 'Password is reset successfully, Try to login again!',
	});
};

const register = async (req, res, next) => {
	const {
		firstName,
		lastName,
		mobileNumber,
		email,
		password,
		passwordConfirm,
	} = req.body;

	if (
		!firstName ||
		!lastName ||
		!email ||
		!password ||
		!passwordConfirm ||
		!mobileNumber
	) {
		return next(new AppError('Invalid inputs', 400));
	}

	const userExists = await Customer.findOne({ email });

	if (userExists) {
		return next(new AppError('Customer already exist', 400));
	}

	const customer = await Customer.create({
		firstName,
		lastName,
		mobileNumber,
		email,
		password,
		passwordConfirm,
	});

	if (!customer) {
		return next(new AppError('Invalid inputs', 400));
	}

	const token = createAndSendToken(customer, req, res);

	res.status(201).json({
		customer: {
			_id: customer.id,
			name: `${customer.firstName} ${customer.lastName}`,
			email: customer.email,
		},
		token,
	});
};

const loginByCode = async (req, res, next) => {
	const { code, codeToken } = req.body;

	if (!code || !codeToken) {
		return next(new AppError('Invalid Inputs!', 400));
	}

	const hashedCodeToken = crypto
		.createHash('sha256')
		.update(codeToken)
		.digest('hex');

	const customer = await Customer.findOne({
		loginCodeToken: hashedCodeToken,
		loginCodeExpires: { $gt: Date.now() },
		loginCode: code,
	}).populate({
		path: 'wishList',
		populate: {
			path: 'coverPhoto',
		},
	});

	// .populate('wishList');

	if (!customer) {
		return next(
			new AppError(
				'The code is expired or wrong please re-enter your email again!',
				400,
			),
		);
	}

	customer.loginCodeToken = undefined;
	customer.loginCodeExpires = undefined;
	customer.loginCode = undefined;

	await customer.save({ validateBeforeSave: false });

	const token = createAndSendToken(customer, req, res);

	res.json({
		customer,
		token,
	});
};

const sendLoginCode = async (req, res, next) => {
	const { email } = req.body;

	if (!email) {
		return next(new AppError('Invalid inputs', 400));
	}

	const customer = await Customer.findOne({ email });

	if (!customer) {
		return next(new AppError('Email not found.', 401));
	}

	const { codeToken, randomCode } = customer.createLoginToken();

	await customer.save({ validateBeforeSave: false });

	try {
		await new Email({ email }, 0).sendLoginCode(randomCode);
	} catch (error) {
		console.log(error);
		return next(
			new AppError(
				'There was an error sending the email, Please try again later!',
				500,
			),
		);
	}

	res.json({
		codeToken,
	});
};

const login = async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new AppError('Invalid inputs', 400));
	}

	const customer = await Customer.findOne({ email }).select('+password');

	if (
		!customer ||
		!(await customer.comparePassword(password, customer.password))
	) {
		return next(new AppError('Incorrect email or password', 401));
	}

	const token = createAndSendToken(customer, req, res);

	// remove email sending when login
	// try {
	// 	await new Email({ email }, 0).sendLoginCode();
	// } catch (error) {
	// 	console.log(error);
	// 	return next(
	// 		new AppError(
	// 			'There was an error sending the email, Please try again later!',
	// 			500,
	// 		),
	// 	);
	// }

	res.json({
		customer: {
			_id: customer.id,
			name: `${customer.firstName} ${customer.lastName}`,
			email: customer.email,
		},
		token,
	});
};

const me = async (req, res) => {
	res.status(200).json(req.customer);
};

const updatePassword = async (req, res, next) => {
	const { newPassword, password, passwordConfirm } = req.body;

	if (!newPassword || !password || !passwordConfirm) {
		return next(new AppError('Invalid Inputs', 401));
	}

	const customer = await Customer.findById(req.customer.id).select(
		'+password',
	);

	const correctPassword = await customer.comparePassword(
		password,
		customer.password,
	);

	if (!correctPassword) {
		return next(new AppError('Your current password is wrong', 401));
	}

	customer.password = newPassword;
	customer.passwordConfirm = passwordConfirm;
	await customer.save();

	const token = createAndSendToken(customer, req, res);

	res.json({
		_id: customer.id,
		name: customer.name,
		email: customer.email,
		token,
	});
};

const orders = async (req, res, next) => {
	const ordersByEmail = await Order.find({
		$and: [
			{ customerID: { $exists: false } },
			{ email: req.customer.email },
		],
	});

	console.log(req.customer._id);

	const ordersByCustomerID = await Order.find({
		$and: [
			{ customerID: { $exists: true } },
			{ customerID: req.customer._id },
		],
	});

	const data = ordersByEmail.concat(ordersByCustomerID);

	res.status(200).json({
		status: 'success',
		data: data,
	});
};

const orderDetails = async (req, res, next) => {
	const id = req.params.id;
	const doc = await Order.findOne({
		$and: [{ _id: id }, { email: req.customer.email }],
	});

	if (!doc) {
		return next(new AppError('No document found with that ID', 404));
	}

	res.status(200).json({
		status: 'success',
		data: doc,
	});
};

const updateWishList = async (req, res, next) => {
	const { wishList } = req.body;
	const customer = await Customer.updateOne(
		{ _id: req.customer._id },
		{ $addToSet: { wishList: wishList } },
	);

	// await customer.save({ validateBeforeSave: false });

	res.status(200).json({
		status: 'success',
		data: customer,
	});
};

const getWishList = async (req, res, next) => {
	const customer = await Customer.findById(req.customer._id).populate({
		path: 'wishList',
		populate: {
			path: 'coverPhoto',
		},
	});

	res.status(200).json({
		status: 'success',
		data: customer.wishList,
	});
};

const removetWishList = async (req, res, next) => {
	const wishList = req.params.id;
	const customer = await Customer.updateOne(
		{ _id: req.customer._id },
		{ $pull: { wishList: wishList } },
	);

	// await customer.save({ validateBeforeSave: false });

	res.status(200).json({
		status: 'success',
		data: customer,
	});
};

module.exports = {
	register,
	login,
	me,
	forgotPassword,
	resetPassword,
	updatePassword,
	updateMe,
	deactivateMe,
	orders,
	sendLoginCode,
	loginByCode,
	orderDetails,
	getWishList,
	updateWishList,
	removetWishList,
};
