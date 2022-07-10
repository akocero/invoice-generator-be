import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const itemSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			unique: [true, 'Name already exist'],
		},
		description: {
			type: String,
		},
		unitCost: {
			type: Number,
			required: [true, 'Unit Cost is required'],
		},
		quantity: {
			type: Number,
			defaultL: 0,
		},
	},
	{ timestamps: true },
);

export default mongoose.model('item', itemSchema);
