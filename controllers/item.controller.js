const Item = require('../models/item.model.js');
const factory = require('../utils/contollersFactory.js');
const AppError = require('../utils/appError.js');

const index = factory.index(
	Item,
	{
		path: 'images',
	},
	{
		path: 'coverPhoto',
	},
);
const store = factory.store(Item);
const show = factory.show(
	Item,
	{
		path: 'images',
	},
	{
		path: 'coverPhoto',
	},
);
const update = factory.update(
	Item,
	{
		path: 'images',
	},
	{
		path: 'coverPhoto',
	},
);
const destroy = factory.destroy(Item);
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

module.exports = {
	index,
	store,
	show,
	destroy,
	update,
	updateQty,
};
