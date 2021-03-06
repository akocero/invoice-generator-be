import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import AppError from '../utils/appError.js';
import sendEmail from '../utils/email.js';
import crypto from 'crypto';

const generateToken = (id, res) => {
	const token = jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

	// const cookieOptions = {
	// 	expires: new Date(
	// 		Date.now() +
	// 			process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
	// 	),
	// 	httpOnly: true,
	// };

	// // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

	// res.cookie('jwt', token, cookieOptions);
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

	const resetToken = user.createPasswordResetToken();
	// saving user details without validation
	user.save({ validateBeforeSave: false });

	const resetURL = `${req.protocol}://${req.get(
		'host',
	)}/api/v1/auth/resetPassword/${resetToken}`;

	const message = `Forgot you password? Submit a PATCH request with your new password to: ${resetURL}. \n If you didn't forget your password, please ignore this email!`;

	try {
		await sendEmail({
			email: user.email,
			subject: 'Your password reset token (valid for 10 min)',
			message,
		});

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
	const token = generateToken(user._id, res);
	res.status(201).json({
		_id: user.id,
		name: user.name,
		email: user.email,
		token: token,
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
	const token = generateToken(user._id, res);
	res.json({
		_id: user.id,
		name: user.name,
		email: user.email,
		token: token,
	});
};

const me = async (req, res) => {
	res.status(200).json({
		status: 'success',
		data: req.user
	});
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

	res.json({
		_id: user.id,
		name: user.name,
		email: user.email,
		token: generateToken(user._id),
	});
};

export {
	register,
	login,
	me,
	forgotPassword,
	resetPassword,
	updatePassword,
	updateMe,
	deactivateMe,
};
