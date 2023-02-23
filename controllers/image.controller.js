const Image = require('../models/image.model.js');
const factory = require('../utils/contollersFactory.js');
const cloudinary = require('../utils/cloudinary.js');
const { catchUnknownError } = require('../middlewares/catchUnknownError.js');

const index = factory.index(Image);
// const store = factory.store(Image);
const show = factory.show(Image);
const update = factory.update(Image);
const destroy = factory.destroy(Image);
const store = catchUnknownError(async (req, res, next) => {
	console.log('req.file.path', req.file.path);
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
