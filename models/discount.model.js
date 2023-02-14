const mongoose = require('mongoose');
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

module.exports = mongoose.model('discount', discountSchema);
