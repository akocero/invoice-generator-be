import express, { json, urlencoded } from 'express';
import morgan from 'morgan';
import 'dotenv/config';
import cors from 'cors';

// routes

import authRouter from './routes/auth.routes.js';
import itemRouter from './routes/item.routes.js';
import customerRouter from './routes/customer.routes.js';

// middlewares / utilities
import AppError from './utils/appError.js';
import globalErrorHandler from './middlewares/globalErrorHandler.js';

const app = express();

app.use(cors());

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.get('/', (req, res, next) => {
	res.redirect('https://hxh-api.vercel.app/');
});

app.use(json());
app.use(urlencoded({ extended: false }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/customers', customerRouter);
app.use('/api/v1/items', itemRouter);

app.use((req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
