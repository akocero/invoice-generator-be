const { catchUnknownError } = require('../middlewares/catchUnknownError.js');
const QueryBuilder = require('../utils/queryBuilder.js');
const AppError = require('../utils/appError.js');
const cloudinary = require('../utils/cloudinary.js');

const paginatedResults = (totalDocuments, queryString, _query, data) => {
	const currentPage = queryString.page ? parseInt(queryString.page) : 1;
	const lastPage = Math.ceil(totalDocuments / _query.query.options.limit);
	const nextPage = currentPage + 1 > lastPage ? null : currentPage + 1;
	const previousPage = currentPage - 1 <= 0 ? null : currentPage - 1;
	const results = data.length;
	const from = _query.query.options.skip + 1;
	const to =
		from + _query.query.options.limit - 1 > totalDocuments
			? totalDocuments
			: from + _query.query.options.limit - 1;

	return {
		_paginate: {
			current_page: currentPage,
			next_page: nextPage,
			previous_page: previousPage,
			last_page: lastPage,
			per_page: _query.query.options.limit,
		},
		results: results,
		total: totalDocuments,
		from: from,
		to: to,
		data: data,
	};
};

const index = (Model, ...populateObject) =>
	catchUnknownError(async (req, res) => {
		let queryString = req.query;

		let _query = new QueryBuilder(Model.find(), queryString)
			.filter()
			.sort()
			.limitFields()
			.paginate();

		const data = populateObject
			? await _query.query.populate(populateObject)
			: await _query.query;

		const totalDocuments = _query.filteredData
			? await Model.countDocuments(_query.filteredData)
			: await Model.estimatedDocumentCount();

		const json = paginatedResults(
			totalDocuments,
			queryString,
			_query,
			data,
		);

		res.status(200).json(json);
	});

const store = (Model) =>
	catchUnknownError(async (req, res, next) => {
		const doc = await Model.create({
			...req.body,
		});

		res.status(200).json({
			status: 'success',
			data: doc,
		});
	});

const show = (Model, ...populateObject) =>
	catchUnknownError(async (req, res, next) => {
		const id = req.params.id;
		const doc = populateObject
			? await Model.findById(id).select('-__v').populate(populateObject)
			: await Model.findById(id).select('-__v');

		if (!doc) {
			return next(new AppError('No document found with that ID', 404));
		}

		res.status(200).json({
			status: 'success',
			data: doc,
		});
	});

const update = (Model, ...populateObject) =>
	catchUnknownError(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!doc) {
			return next(new AppError('No document found with that ID', 404));
		}

		const _doc = populateObject ? await doc.populate(populateObject) : doc;

		res.status(200).json(_doc);
	});

const destroy = (Model) =>
	catchUnknownError(async (req, res, next) => {
		const id = req.params.id;
		const doc = await Model.findOne({ _id: id });

		if (!doc) {
			return next(
				new AppError(`No document found with this ${id} ID`, 404),
			);
		}

		await doc.softDelete();

		res.status(204).json({});
	});

const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

const destroyImage = (Model) =>
	catchUnknownError(async (req, res, next) => {
		const filteredBody = filterObj(
			req.body,
			'image_id',
			'is_multiple_image',
			'column_name',
		);

		const { image_id, is_multiple_image, column_name } = req.body;

		const doc = await Model.findByIdAndUpdate(req.params.id, filteredBody, {
			new: true,
			runValidators: true,
		});

		if (!req.body.image_id) {
			return next(new AppError('image_id is Required!', 400));
		}

		if (!column_name) {
			return next(new AppError('column_name is Required!', 400));
		}

		if (!doc) {
			return next(new AppError('No document found with that ID', 404));
		}

		if (is_multiple_image) {
			const imageTodelete = doc[column_name].find(
				(image) => image.public_id === req.body.image_id,
			);

			if (!imageTodelete) {
				return next(new AppError('No image found with that ID', 404));
			}

			doc[column_name] = doc[column_name].filter(
				(image) => req.body.image_id !== image.public_id,
			);
		} else {
			if (doc[column_name].public_id != image_id) {
				return next(new AppError('No image found with that ID', 404));
			}

			doc[column_name] = '';
		}
		await cloudinary.uploader.destroy(req.body.image_id);

		await doc.save();

		res.status(200).json({});
	});

module.exports = { index, show, store, destroy, update, destroyImage };
