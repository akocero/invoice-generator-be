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
			required: [true, 'Please add a password'],
			select: false,
		},
		passwordConfirm: {
			type: String,
			required: [true, 'Please confirm your password'],
			validate: {
				// This only works on CREATE and SAVE!!!
				validator: function (el) {
					return el === this.password;
				},
				message: 'Passwords are not the same!',
			},
		},
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
		active: {
			type: Boolean,
			default: true,
			select: false,
		},
	},
	{ timestamps: true },
);

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

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
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
