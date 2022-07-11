import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const discountSchema = new Schema(
	{
		code: {
			type: String,
			required: [true, 'Code is required'],
			unique: [true, 'Code already exist'],
		},
		discountKind: {
			type: String,
			required: [true, 'Type is required'],
		},
		discountValue: {
			type: Number,
			required: [true, 'Value is required'],
		},
	},
	{ timestamps: true },
);

export default mongoose.model('discount', discountSchema);
