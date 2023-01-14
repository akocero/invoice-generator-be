import Payment from '../models/payment.model.js';
import factory from '../utils/contollersFactory.js';

const index = factory.index(Payment);
const store = factory.store(Payment);
const show = factory.show(Payment);
const update = factory.update(Payment);
const destroy = factory.destroy(Payment);
// const destroyImage = factory.destroyImage(Item);

export { index, store, show, destroy, update };
