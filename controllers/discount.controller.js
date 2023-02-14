const Discount = require('../models/discount.model.js');
const factory = require('../utils/contollersFactory.js');

const index = factory.index(Discount);
const store = factory.store(Discount);
const show = factory.show(Discount);
const update = factory.update(Discount);
const destroy = factory.destroy(Discount);

module.exports = { index, store, show, destroy, update };
