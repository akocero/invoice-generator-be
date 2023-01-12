import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const collectionSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			unique: [true, 'Name already exist'],
		},
		description: {
			type: String,
		},
	},
	{ timestamps: true },
);

export default mongoose.model('collection', collectionSchema);
