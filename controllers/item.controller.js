import Item from '../models/item.model.js';
import cloudinary from '../utils/cloudinary.js';
import factory from '../utils/contollersFactory.js';
import AppError from '../utils/appError.js';

const index = factory.index(Item);
const store = factory.store(Item);
const show = factory.show(Item);
const update = factory.update(Item);
const destroy = factory.destroy(Item);
const destroyImage = factory.destroyImage(Item);
const updateQty = async (req, res, next) => {
	const { qty } = req.body;

	const doc = await Item.findByIdAndUpdate(req.params.id, {
		$inc: { quantity: -qty },
	});

	if (!doc) {
		return next(new AppError('No document found with that ID', 404));
	}

	res.status(200).json({
		status: 'success',
		data: doc,
	});
};

export { index, store, show, destroy, update, destroyImage, updateQty };
