const Invoice = require('../models/invoice.model.js');
const factory = require('../utils/contollersFactory.js');

const index = factory.index(Invoice);
const store = factory.store(Invoice);
const show = factory.show(Invoice);
const update = factory.update(Invoice);
const destroy = factory.destroy(Invoice);

module.exports = { index, store, show, destroy, update };
