const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const viewpath = path.join(__dirname, '../views/');

// console.log(viewpath);
// const sendEmail = async (options) => {
// 	console.log(
// 		process.env.EMAIL_HOST,
// 		process.env.EMAIL_PORT,
// 		process.env.EMAIL_USERNAME,
// 		process.env.EMAIL_PASSWORD,
// 	);
// 	// 1) Create a transporter
// 	const transporter = nodemailer.createTransport({
// 		host: process.env.EMAIL_HOST,
// 		//port: process.env.EMAIL_PORT,
// 		auth: {
// 			user: process.env.EMAIL_USERNAME,
// 			pass: process.env.EMAIL_PASSWORD,
// 		},
// 	});

// 	const handlebarOptions = {
// 		viewEngine: {
// 			extName: '.handlebars',
// 			partialsDir: viewpath,
// 			defaultLayout: false,
// 		},
// 		viewPath: viewpath,
// 		extName: '.handlebars',
// 	};

// 	transporter.use('compile', hbs(handlebarOptions));

// 	// 2) Define the email options
// 	const mailOptions = {
// 		from: 'Eugene Badato <badatoeugenepaulm@gmail.com>',
// 		to: options.email,
// 		subject: options.subject,
// 		template: 'email',
// 		context: {
// 			name: 'John Doe',
// 		},
// 		// html:
// 	};

// 	// 3) Actually send the email
// 	await transporter.sendMail(mailOptions);
// };

class Email {
	constructor(user, url) {
		this.to = user.email;
		this.url = url;
		this.from = `Eugene Badato <badatoeugenepaulm@gmail.com>`;
	}

	newTransport() {
		let transporter;
		console.log(process.env.NODE_ENV);
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

	convertToCurrency(value) {
		return Number(parseFloat(value).toFixed(2)).toLocaleString('en', {
			minimumFractionDigits: 2,
		});
	}

	convertItemsToCuurency(items) {
		return items.map((item) => {
			item.total = this.convertToCurrency(item.total);
			return item;
		});
	}

	async sendFileLink() {
		await this.send('email', 'Welcome to the Papierenei Family!', {
			name: 'John Doe',
		});
	}

	async sendOrderDetails(orderDetails) {
		console.log('orderDetails', orderDetails);

		const { firstName, items, total, shippingDetails, subtotal } =
			orderDetails;

		await this.send('order', 'Welcome to the Papierenei Family!', {
			firstName,
			items: this.convertItemsToCuurency(items),
			total: this.convertToCurrency(total),
			subtotal: this.convertToCurrency(subtotal),
			shippingFee: this.convertToCurrency(shippingDetails.fee),
		});
	}

	async sendPasswordReset() {
		await this.send(
			'password_reset',
			'Your password reset token (valid for only 10 minutes)',
			{ url: this.url, name: this.to },
		);
	}
}

module.exports = Email;
