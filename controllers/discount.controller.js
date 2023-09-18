const Discount = require('../models/discount.model.js');
const factory = require('../utils/contollersFactory.js');
const AppError = require('../utils/appError.js');

const index = factory.index(Discount);
const store = factory.store(Discount);
const show = factory.show(Discount);
const update = factory.update(Discount);
const destroy = factory.destroy(Discount);
const findByCode = async (req, res, next) => {
	const code = req.params.code;

	const doc = await Discount.findOne({
		$and: [{ code }, { isPublished: 1 }],
	});

	if (!doc) {
		return next(new AppError('Resource not found', 404));
	}

	res.status(200).json({
		status: 'success',
		data: doc,
	});
};

module.exports = { index, store, show, destroy, update, findByCode };
