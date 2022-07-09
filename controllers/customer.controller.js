import Customer from '../models/customer.model.js';
import cloudinary from '../utils/cloudinary.js';
import factory from '../utils/contollersFactory.js';
import AppError from '../utils/appError.js';

const index = factory.index(Customer);
const store = factory.store(Customer);
const show = factory.show(Customer);
const update = factory.update(Customer);
const destroy = factory.destroy(Customer);

export { index, store, show, destroy, update };
