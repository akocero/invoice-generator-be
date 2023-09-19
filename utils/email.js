const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const {
	convertToCurrency,
	objectFieldToCurrency,
} = require('./currencyHelper');

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
			from: this.from,
			to: this.to,
			subject,
			template,
			context,
		};
		// 3) Create a transport and send email
		await this.newTransport().sendMail(mailOptions);
	}

	async sendFileLink() {
		await this.send(
			'digital_product',
			'Welcome to the Papierenei Family!',
			{
				name: 'John Doe',
			},
		);
	}

	async sendOwnerOrderNotif() {
		await this.send('email', 'Welcome to the Papierenei Family!', {
			name: 'John Doe',
		});
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

		await this.send('order_receipt', 'Thank you for your purchase!', {
			firstName,
			fullName: firstName + ' ' + lastName,
			paymentMethod,
			contactNumber,
			email,
			items: objectFieldToCurrency(items, 'total'),
			total: convertToCurrency(total),
			subtotal: convertToCurrency(subtotal),
			shippingFee: convertToCurrency(shippingDetails.fee),
		});
	}

	async sendLoginCode(code) {
		await this.send(
			'login_code',
			'This code is valid for only 15 minutes',
			{
				code,
				name: this.to,
			},
		);
	}

	async sendPasswordReset(url) {
		await this.send(
			'password_reset',
			'Your password reset token (valid for only 10 minutes)',
			{ url, name: this.to },
		);
	}
}

module.exports = Email;
