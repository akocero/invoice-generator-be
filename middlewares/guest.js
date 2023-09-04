const jwt = require('jsonwebtoken');
const Customer = require('../models/customer.model.js');
const AppError = require('../utils/appError.js');
const { catchUnknownError } = require('./catchUnknownError.js');

exports.protect = catchUnknownError(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		// Get token from header
		token = req.headers.authorization.split(' ')[1];
	}
	// console.log(req.headers);
	if (!token) {
		return next(new AppError('Forbidden: No provided token', 403));
	}

	// Verify token
	const decoded = jwt.verify(token, process.env.JWT_GUEST_SECRET);

	// Get user from the token
	const authenticatedCustomer = await Customer.findById(decoded.id).select(
		'-password -createdAt -updatedAt -__v',
	);

	if (!authenticatedCustomer) {
		return next(
			new AppError(
				'The user belonging to this token does no longer exist.',
				401,
			),
		);
	}

	if (authenticatedCustomer.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError(
				'Customer recently changed password! Please log in again.',
				401,
			),
		);
	}

	req.customer = authenticatedCustomer;
	next();
});

// module.exports {
// 	protect,
// 	restrictedTo,
// };
