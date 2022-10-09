import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ecommSettingSchema = new Schema(
	{
		banners: [
			{
				text: {
					type: String,
					required: [true, 'Text is required'],
				},
				name: {
					type: String,
					required: [true, 'Name is required'],
					unique: [true, 'Name already exist'],
				},
			},
		],
		heros: [
			{
				public_id: String,
				secure_url: String,
				width: Number,
				height: Number,
				isActive: Boolean,
			},
		],
	},
	{ timestamps: true },
);

export default mongoose.model('ecommSetting', ecommSettingSchema);
