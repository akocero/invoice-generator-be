const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const {
	convertToCurrency,
	objectFieldToCurrency,
} = require('./currencyHelper');
const moment = require('moment');

const viewpath = path.join(__dirname, '../views/');
class Email {
	constructor(user) {
		this.to = user.email;
		this.from = 'papierenei@gmail.com';
	}

	newTransport() {
		console.log('SENDING AS: ', process.env.NODE_ENV);
		let transporter;
		if (process.env.NODE_ENV === 'development') {
			// Sendgrid
			transporter = nodemailer.createTransport({
				host: process.env.MAILTRAP_HOST,
				port: process.env.MAILTRAP_PORT,
				auth: {
					user: process.env.MAILTRAP_USERNAME,
					pass: process.env.MAILTRAP_PASSWORD,
				},
			});
		} else {
			transporter = nodemailer.createTransport({
				host: process.env.EMAIL_HOST,
				auth: {
					user: process.env.EMAIL_USERNAME,
					pass: process.env.EMAIL_PASSWORD,
				},
			});
		}

		const handlebarOptions = {
			viewEngine: {
				extName: '.handlebars',
				partialsDir: viewpath,
				defaultLayout: false,
			},
			viewPath: viewpath,
			extName: '.handlebars',
		};

		transporter.use('compile', hbs(handlebarOptions));

		return transporter;
	}

	// Send the actual email
	async send(template, subject, context = {}) {
		// 2) Define email options
		const mailOptions = {
			from: 'Papier Renei <papierenei@gmail.com>',
			to: this.to,
			subject,
			template,
			context,
		};

		try {
			await this.newTransport().sendMail(mailOptions);
			return true;
		} catch (error) {
			console.log('Email Error: ', error);
			return false;
		}
		// 3) Create a transport and send email
	}

	async sendFileLink() {
		return await this.send(
			'digital_product',
			'Welcome to the Papierenei Family!',
			{
				name: 'John Doe',
			},
		);
	}

	async sendOwnerOrderNotif() {
		return await this.send(
			'owner_order_notif',
			'You have received an order',
			{
				name: 'TEST NAME',
			},
		);
	}

	async sendOrderDetails(orderDetails) {
		const {
			firstName,
			lastName,
			email,
			contactNumber,
			items,
			paymentMethod,
			total,
			shippingDetails,
			subtotal,
		} = orderDetails;

		return await this.send(
			'order_receipt',
			'Thank you for your purchase!',
			{
				firstName,
				fullName: firstName + ' ' + lastName,
				paymentMethod,
				contactNumber,
				email,
				items: objectFieldToCurrency(items, 'total'),
				total: convertToCurrency(total),
				subtotal: convertToCurrency(subtotal),
				shippingFee: convertToCurrency(shippingDetails.fee),
			},
		);
	}

	async sendOrderPlaced(orderDetails) {
		const {
			firstName,
			lastName,
			email,
			contactNumber,
			items,
			_id,
			total,
			shippingDetails,
			discount,
			subtotal,
			createdAt,
		} = orderDetails;

		return await this.send('order_place', 'Thank you for your purchase!', {
			firstName,
			fullName: firstName + ' ' + lastName,
			orderID: _id,
			contactNumber,
			createdAt: moment(new Date(createdAt)).format(
				'MMMM Do YYYY, h:mm:ss a',
			),
			email,
			items: objectFieldToCurrency(items, 'total'),
			total: convertToCurrency(total),
			subtotal: convertToCurrency(subtotal),
			shippingFee: convertToCurrency(shippingDetails.fee),
			discountTotal: discount
				? convertToCurrency(discount.discountTotal)
				: 0,
		});
	}

	async sendLoginCode(code) {
		return await this.send(
			'login_code',
			'This code is valid for only 15 minutes',
			{
				code,
				name: this.to,
			},
		);
	}

	async sendPasswordReset(url) {
		return await this.send(
			'password_reset',
			'Your password reset token (valid for only 10 minutes)',
			{ url, name: this.to },
		);
	}
}

module.exports = Email;
