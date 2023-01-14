import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import validator from 'validator';

const orderSchema = new Schema(
	{
		firstName: {
			type: String,
			required: [true, 'First Name is required'],
			trim: true,
			lowercase: true,
		},
		lastName: {
			type: String,
			required: [true, 'Last Name is required'],
			trim: true,
			lowercase: true,
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
				item_id: {
					type: String,
					required: [true, 'Product ID is Required'],
				},
				name: {
					type: String,
					required: [true, 'Product Name is Required'],
				},
				qty: {
					type: Number,
					required: [true, 'Product Quantity is Required'],
				},
				price: {
					type: Number,
					required: [true, 'Product Price Code is Required'],
				},
				total: {
					type: Number,
					required: [true, 'Product Total Code is Required'],
				},
			},
		],
		subtotal: {
			type: Number,
			required: [true, 'Subtotal is Required'],
		},
		total: {
			type: Number,
			required: [true, 'Total is Required'],
		},
		shippingDetails: {
			fee: {
				type: Number,
			},
		},
		discount: {
			type: String,
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
