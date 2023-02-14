const Payment = require('../models/payment.model.js');
const factory = require('../utils/contollersFactory.js');

const index = factory.index(Payment);
const store = factory.store(Payment);
const show = factory.show(Payment);
const update = factory.update(Payment);
const destroy = factory.destroy(Payment);
// const destroyImage = factory.destroyImage(Item);

module.exports = { index, store, show, destroy, update };
