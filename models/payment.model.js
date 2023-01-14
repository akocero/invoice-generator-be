import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
	{
		order: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Order',
		},
		status: {
			type: String,
			default: 'verified',
		},
		gateway: {
			type: String,
		},
		transactionNumner: {
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
	{ timestamps: true },
);

export default mongoose.model('payment', paymentSchema);
