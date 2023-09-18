const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const customerSchema = new Schema(
	{
		firstName: {
			type: String,
			required: [true, 'First Name is required'],
			lowercase: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: [true, 'Last Name is required'],
			lowercase: true,
			trim: true,
		},
		email: {
			type: String,
			required: [true, 'Please provide your email'],
			unique: true,
			lowercase: true,
			validate: [validator.isEmail, 'Please provide a valid email'],
		},
		homeAddress: {
			type: String,
		},
		streetAddress: {
			type: String,
		},
		city: {
			type: String,
		},
		province: {
			type: String,
		},
		barangay: {
			type: String,
		},
		state: {
			type: String,
		},
		zipCode: {
			type: String,
		},
		mobileNumber: {
			type: String,
			required: [true, 'Mobile Number is required'],
		},
		description: {
			type: String,
		},
		password: {
			type: String,
			required: [false, 'Please add a password'],
			select: false,
		},
		wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'item' }],
		passwordConfirm: {
			type: String,
			required: [false, 'Please confirm your password'],
		},
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
		loginCodeToken: String,
		loginCodeExpires: Date,
		loginCode: String,
		active: {
			type: Boolean,
			default: true,
			select: false,
		},
		isDeleted: {
			type: Boolean,
			default: false,
			select: false,
		},
	},
	{ timestamps: true },
);

customerSchema.pre(/^find/, function (next) {
	// console.log('THIS', this);
	this.where({
		$or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
	});
	return next();
});

customerSchema.methods.softDelete = function () {
	this.isDeleted = true;

	return this.save({ validateBeforeSave: false });
};

customerSchema.pre('save', async function (next) {
	// Only run this function if password was actually modified
	if (!this.isModified('password')) return next();

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);

	// Delete passwordConfirm field before saving
	this.passwordConfirm = undefined;
	next();
});

customerSchema.methods.comparePassword = async function (
	candidatePassword,
	userPassword,
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

customerSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');
	// Date now + 10 minues * 60 seconds * 1000 miliseconds
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

customerSchema.methods.createLoginToken = function () {
	const codeToken = crypto.randomBytes(32).toString('hex');

	this.loginCodeToken = crypto
		.createHash('sha256')
		.update(codeToken)
		.digest('hex');
	// Date now + 15 minues * 60 seconds * 1000 miliseconds
	this.loginCodeExpires = Date.now() + 15 * 60 * 1000;
	const min = 100000;
	const max = 999999;
	const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;

	this.loginCode = randomCode;

	return { codeToken, randomCode };
};

customerSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10,
		);

		return JWTTimestamp < changedTimestamp;
	}

	// False means NOT changed
	return false;
};

customerSchema.pre('save', function (next) {
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangedAt = Date.now() - 1000;
	next();
});

module.exports = mongoose.model('customer', customerSchema);
