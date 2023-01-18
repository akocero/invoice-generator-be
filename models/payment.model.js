import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
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
	{ timestamps: true },
);

export default mongoose.model('Payment', paymentSchema);
