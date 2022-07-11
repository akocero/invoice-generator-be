import Discount from '../models/discount.model.js';
import cloudinary from '../utils/cloudinary.js';
import factory from '../utils/contollersFactory.js';
import AppError from '../utils/appError.js';

const index = factory.index(Discount);
const store = factory.store(Discount);
const show = factory.show(Discount);
const update = factory.update(Discount);
const destroy = factory.destroy(Discount);

export { index, store, show, destroy, update };
