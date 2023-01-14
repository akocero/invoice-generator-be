import mongoose from 'mongoose';
import 'dotenv/config';
import Item from '../models/item.model.js';

console.log(process.env.MONGODB_URI);

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
		console.log('Succesfully updated!');
		process.exit();
	} catch (error) {
		console.log(error);
	}
};

console.log(process.argv);

if (process.argv[2] === '--unPublishedAllItems') {
	unPublishedAllItems();
}

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
//   })
//   .then(() => console.log('DB connection successful!'));
