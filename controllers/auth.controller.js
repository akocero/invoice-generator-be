const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const Email = require('../utils/email.js');
const crypto = require('crypto');

const createToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createAndSendToken = (user, req, res) => {
	const token = createToken(user._id);

	res.cookie('jwt', token, {
		expires: new Date(
			Date.now() +
				process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
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
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(new AppError('This email is not exist', 404));
	}
	// populate to user passwordResetToken and PasswordResetTokenExpires
	const resetToken = user.createPasswordResetToken();

	// saving user details without validation
	await user.save({ validateBeforeSave: false });

	// this is for same server request
	// const resetURL = `${req.protocol}://${req.get(
	// 	'host',
	// )}/api/v1/auth/resetPassword/${resetToken}`;

	// req.headers.origin it will work only at system request not on postman
	const resetURL = `${req.headers.origin}/auth/reset_password/${resetToken}`;

	try {
		await new Email({ email: user.email }, resetURL).sendPasswordReset();

		res.status(200).json({
			status: 'success',
			message: 'Token sent to your email!',
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;

		await user.save({ validateBeforeSave: false });

		return next(
			new AppError(
				'There was an error sending the email, Please try again later!',
				500,
			),
		);
	}
};

const deactivateMe = async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });

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

	const filteredBody = filterObj(req.body, 'name', 'email');
	// if (req.file) filteredBody.photo = req.file.filename; for photos

	const updatedUser = await User.findByIdAndUpdate(
		req.user.id,
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

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	if (!user) {
		return next(
			new AppError('Token is invalid or expired, Please try again!', 400),
		);
	}

	if (!req.body.password) {
		return next(new AppError('Please provide a new password!', 400));
	}

	user.password = password;
	user.passwordConfirm = passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;

	await user.save();

	res.status(200).json({
		status: 'success',
		message: 'Password is reset successfully, Try to login again!',
	});
};

const register = async (req, res, next) => {
	const { name, email, password, passwordConfirm } = req.body;

	if (!name || !email || !password || !passwordConfirm) {
		return next(new AppError('Invalid inputs', 400));
	}

	const userExists = await User.findOne({ email });

	if (userExists) {
		return next(new AppError('User already exist', 400));
	}

	const user = await User.create({
		name,
		email,
		password,
		passwordConfirm,
	});

	if (!user) {
		return next(new AppError('Invalid inputs', 400));
	}

	const token = createAndSendToken(user, req, res);

	res.status(201).json({
		user: {
			_id: user.id,
			name: user.name,
			email: user.email,
		},
		token,
	});
};

const login = async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new AppError('Invalid inputs', 400));
	}

	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.comparePassword(password, user.password))) {
		return next(new AppError('Incorrect email or password', 401));
	}

	const token = createAndSendToken(user, req, res);

	// remove email sending when login
	// try {
	// 	await new Email({ email }, 0).sendFileLink();
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
		user: {
			_id: user.id,
			name: user.name,
			email: user.email,
		},
		token,
	});
};

const me = async (req, res) => {
	res.status(200).json(req.user);
};

const updatePassword = async (req, res, next) => {
	const { newPassword, password, passwordConfirm } = req.body;

	if (!newPassword || !password || !passwordConfirm) {
		return next(new AppError('Invalid Inputs', 400));
	}

	const user = await User.findById(req.user.id).select('+password');

	const correctPassword = await user.comparePassword(password, user.password);

	if (!correctPassword) {
		return next(new AppError('Your current password is wrong', 400));
	}

	user.password = newPassword;
	user.passwordConfirm = passwordConfirm;
	await user.save();

	const token = createAndSendToken(user, req, res);

	res.json({
		_id: user.id,
		name: user.name,
		email: user.email,
		token,
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
};
