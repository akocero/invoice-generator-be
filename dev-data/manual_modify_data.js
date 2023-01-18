import mongoose from 'mongoose';
import 'dotenv/config';
import Item from '../models/item.model.js';
import Order from '../models/order.model.js';

console.log(process.env.MONGODB_URI);

// !this code is to remove a field in document
// !It will permanently deleted the field in every document

// * to get the specific model to unset a field
// if (req.baseUrl.includes('items')) {
// * this scripts is to unset or removed the field
// * in this example, I removed the categories field
// console.log(await Model.updateMany([{ $unset: 'categories' }]));
//}

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI);

		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

connectDB();

const unPublishedAllItems = async () => {
	try {
		await Item.updateMany({}, { $set: { isPublished: 0 } });
		console.log('Succesfully Unublished All Data!');
		process.exit();
	} catch (error) {
		console.log(error);
	}
};

const pendingAllOrders = async () => {
	try {
		await Order.updateMany({}, { $set: { status: 'pending' } });
		console.log('Succesfully Pending All Orders!');
		process.exit();
	} catch (error) {
		console.log(error);
	}
};

const publishedAllItems = async () => {
	try {
		await Item.updateMany({}, { $set: { isPublished: 1 } });
		console.log('Succesfully Published All Data!');
		process.exit();
	} catch (error) {
		console.log(error);
	}
};

const deleteOrderData = async () => {
	try {
		await Order.deleteMany();
		//   await User.deleteMany();
		//   await Review.deleteMany();
		console.log('Data successfully deleted!');
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

console.log(process.argv);

if (process.argv[2] === '--unPublishedAllItems') {
	unPublishedAllItems();
}

if (process.argv[2] === '--publishedAllItems') {
	publishedAllItems();
}

if (process.argv[2] === '--deleteAllOrders') {
	deleteOrderData();
}

if (process.argv[2] === '--pendingAllOrders') {
	pendingAllOrders();
}

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
//   })
//   .then(() => console.log('DB connection successful!'));
