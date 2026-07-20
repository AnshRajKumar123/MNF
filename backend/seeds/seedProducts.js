const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("../models/Product");
const { assets } = require("./assets1");

const seedProducts = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected");
        await Product.deleteMany();
        console.log("🗑 Old products deleted");
        console.log("Type:", typeof assets);
        console.log("Is Array:", Array.isArray(assets));
        console.log("Length:", assets.length);
        console.log("First Product:", assets[0]);
        await Product.insertMany(assets);
        console.log(`🎉 ${assets.length} products inserted successfully`);
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);

    }

};

seedProducts();