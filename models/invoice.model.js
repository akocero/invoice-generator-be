const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const invoiceSchema = new Schema(
	{
		invoiceFor: {
			name: {
				type: String,
				required: [true, 'Name is required'],
			},
			mobileNumber: {
				type: String,
				required: [true, 'Mobile Number is required'],
			},
			email: {
				type: String,
				required: [true, 'Email is required'],
			},
			streetAddress: String,
			city: String,
			state: String,
			barangay: String,
			province: String,
			zipCode: String,
		},
		payableTo: {
			type: String,
			required: [true, 'Payable To is required'],
		},
		dueDate: {
			type: Date,
			required: [true, 'Due Date is required'],
		},
		invoiceNo: {
			type: String,
			required: [true, 'Invoice No To is required'],
		},
		items: [
			{
				name: String,
				qty: Number,
				unitPrice: Number,
			},
		],
		discount: {
			code: String,
			discountKind: String,
			discountValue: Number,
		},
		shippingFee: {
			type: Number,
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
	},
	{ timestamps: true },
);

module.exports = mongoose.model('invoice', invoiceSchema);
