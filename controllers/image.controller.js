const Image = require('../models/image.model.js');
const EcommSetting = require('../models/ecomm_setting.model.js');
const Item = require('../models/item.model.js');
const factory = require('../utils/contollersFactory.js');
const cloudinary = require('../utils/cloudinary.js');
const { catchUnknownError } = require('../middlewares/catchUnknownError.js');

const index = factory.index(Image);
const show = factory.show(Image);
const update = factory.update(Image);
const destroy = catchUnknownError(async (req, res, next) => {
	const id = req.params.id;
	const doc = await Image.findByIdAndDelete(id);

	if (!doc) {
		return next(new AppError(`No document found with this ${id} ID`, 404));
	}

	const ecomSet = await EcommSetting.updateMany(
		{},
		{
			$pull: {
				navbarBGs: id,
				heros: id,
			},
		},
	);

	const item = await Item.updateMany(
		{},
		{
			$pull: {
				images: id,
				coverPhoto: id,
			},
		},
	);

	await EcommSetting.updateOne(
		{
			activeHero: id,
		},
		{
			$unset: {
				activeHero: '',
			},
		},
	);

	await EcommSetting.updateOne(
		{
			activeNavbarBG: id,
		},
		{
			$unset: {
				activeNavbarBG: '',
			},
		},
	);

	await cloudinary.uploader.destroy(doc.public_id);

	res.status(204).json({});
});
const store = catchUnknownError(async (req, res, next) => {
	const image_res = await cloudinary.uploader.upload(req.file.path, {
		upload_preset:
			process.env.CLOUDINARY_IMAGE_PRESET || 'development_preset',
	});

	const doc = await Image.create({
		...image_res,
	});

	res.status(200).json({
		status: 'success',
		data: doc,
	});
});

module.exports = { index, store, show, destroy, update };
