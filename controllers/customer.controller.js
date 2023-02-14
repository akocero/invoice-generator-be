const Customer = require('../models/customer.model.js');
const cloudinary = require('../utils/cloudinary.js');
const factory = require('../utils/contollersFactory.js');
const AppError = require('../utils/appError.js');

const index = factory.index(Customer);
const store = factory.store(Customer);
const show = factory.show(Customer);
const update = factory.update(Customer);
const destroy = factory.destroy(Customer);

module.exports = { index, store, show, destroy, update };
