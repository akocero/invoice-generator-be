const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// routes
const authRouter = require('./routes/auth.routes');
const guestRouter = require('./routes/guest.routes.js');

const itemRouter = require('./routes/item.routes.js');
const customerRouter = require('./routes/customer.routes.js');
const invoiceRouter = require('./routes/invoice.routes.js');
const discountRouter = require('./routes/discount.routes.js');
const userRouter = require('./routes/user.routes.js');
const collectionRouter = require('./routes/collection.routes.js');
const ecommSettingRouter = require('./routes/ecomm_setting.routes.js');
const tagRouter = require('./routes/tag.routes.js');
const orderRouter = require('./routes/order.routes.js');
const paymentRouter = require('./routes/payment.routes.js');
const imageRouter = require('./routes/image.routes.js');
const categoryRouter = require('./routes/category.routes.js');
const heroRouter = require('./routes/hero.routes.js');

// middlewares / utilities
const AppError = require('./utils/appError');
const globalErrorHandler = require('./middlewares/globalErrorHandler');

const app = express();

app.use(cors());

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.get('/', (req, res, next) => {
	res.redirect('https://hxh-api.vercel.app/');
});

app.get('/api/v1', (req, res, next) => {
	res.status(200).json({
		message: 'Welcome to Papier Renei API Version 1!',
	});
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/guest/auth', guestRouter);

app.use('/api/v1/customers', customerRouter);
app.use('/api/v1/items', itemRouter);
app.use('/api/v1/invoices', invoiceRouter);
app.use('/api/v1/discounts', discountRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/collections', collectionRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/tags', tagRouter);
app.use('/api/v1/ecomm_settings', ecommSettingRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/images', imageRouter);
app.use('/api/v1/heros', heroRouter);

app.use((req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
