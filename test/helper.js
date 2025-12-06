const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const closeDB = async () => {
    await mongoose.connection.close();
};

const clearDB = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
};

module.exports = { connectDB, closeDB, clearDB };
