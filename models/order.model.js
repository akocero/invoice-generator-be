const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const AutoIncrement = require('mongoose-sequence')(mongoose);

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
		customerID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Customer',
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
			default: 'pending',
		},
		orderfulfilledDate: {
			type: Date,
		},
		paymentStatus: {
			type: String,
			default: 'pending',
		},
		paymentMethod: {
			type: String,
			required: [true, 'Payment method is required!'],
		},
		orderPaidDate: {
			type: Date,
		},
		datePaid: {
			type: Date,
		},
		notes: {
			type: String,
		},
		payments: [
			{
				status: {
					type: String,
					required: [true, 'Payment Status is required'],
				},
				gateway: {
					type: String,
				},
				transactionNumber: {
					type: String,
					required: [true, 'Transaction Number is required'],
				},
				amount: {
					type: Number,
					required: [true, 'Amount is required'],
				},
				paymentType: {
					type: String,
					required: [true, 'Payment Type is required'],
				},
			},
		],
		isDeleted: {
			type: Boolean,
			default: false,
			select: false,
		},
	},
	{ timestamps: true },
);

orderSchema.plugin(AutoIncrement, { inc_field: 'orderID' });

orderSchema.pre(/^find/, function (next) {
	// console.log('THIS', this);
	this.where({
		$or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
	});
	return next();
});

orderSchema.methods.softDelete = function () {
	this.isDeleted = true;

	return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('Order', orderSchema);
