import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import validator from 'validator';

const customerSchema = new Schema(
	{
		firstName: {
			type: String,
			required: [true, 'First Name is required'],
		},
		lastName: {
			type: String,
			required: [true, 'Last Name is required'],
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
		mobileNumber: {
			type: String,
			required: [true, 'Last Name is required'],
		},
		description: {
			type: String,
		},
	},
	{ timestamps: true },
);

export default mongoose.model('customer', customerSchema);
