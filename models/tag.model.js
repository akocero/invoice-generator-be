import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const tagSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			unique: [true, 'Name already exist'],
		},
	},
	{ timestamps: true },
);

export default mongoose.model('Tag', tagSchema);
