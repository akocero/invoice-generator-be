import Invoice from '../models/invoice.model.js';
import cloudinary from '../utils/cloudinary.js';
import factory from '../utils/contollersFactory.js';
import AppError from '../utils/appError.js';

const index = factory.index(Invoice);
const store = factory.store(Invoice);
const show = factory.show(Invoice);
const update = factory.update(Invoice);
const destroy = factory.destroy(Invoice);

export { index, store, show, destroy, update };
