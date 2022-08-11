import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import validator from 'validator';

const customerSchema = new Schema(
	{
		firstName: {
			type: String,
			required: [true, 'First Name is required'],
			lowercase: true, 
			trim: true
		},
		lastName: {
			type: String,
			required: [true, 'Last Name is required'],
			lowercase: true, 
			trim: true
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
			type: String
		},
		city: {
			type: String
		},
		state: {
			type: String
		},
		zipCode: {
			type: String
		},
		mobileNumber: {
			type: String,
			required: [true, 'Mobile Number is required'],
		},
		description: {
			type: String,
		},
	},
	{ timestamps: true },
);

export default mongoose.model('customer', customerSchema);
