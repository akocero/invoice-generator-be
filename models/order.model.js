import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import validator from 'validator';

const orderSchema = new Schema(
	{
		firstName: {
			type: String,
			required: [true, 'First Name is required'],
		},
		lastName: {
			type: String,
			required: [true, 'Last Name is required'],
		},
		contactNumber: {
			type: String,
			required: [true, 'Contact Number is required'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
		},
		country: {
			type: String,
			required: [true, 'Country is Required'],
		},
		streetAddress: {
			type: String,
			required: [true, 'Street is Required'],
		},
		city: {
			type: String,
			required: [true, 'City is Required'],
		},
		state: {
			type: String,
			required: [true, 'State is Required'],
		},
		zipCode: {
			type: String,
			required: [true, 'Zip Code is Required'],
		},
		items: [
			{
				name: {
					type: String,
				},
				qty: {
					type: Number,
				},
				price: {
					type: Number,
				},
			},
		],
		shippingDetails: {
			fee: {
				type: Number,
			},
		},
		status: {
			type: String,
			default: 'unsettled',
		},
		datePaid: {
			type: Date,
		},
		notes: {
			type: String,
		},
		paymentDetails: {
			paymentType: {
				type: String,
			},
		},
	},
	{ timestamps: true },
);

export default mongoose.model('order', orderSchema);
