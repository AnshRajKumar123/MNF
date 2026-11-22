const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("../models/Product");
const { assets } = require("./assets1");

const seedProducts = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in your environment variables.");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");

        // Purge existing catalog
        await Product.deleteMany();
        console.log("🗑 Old products purged");

        // Format raw assets to match schema and UI expectations (foodType, availability, clean slugs)
        const formattedProducts = assets.map((item) => {
            const isNonVeg =
                item.tags?.some((tag) =>
                    ["non-veg", "non-vegetarian", "chicken", "beef", "fish", "mutton"].includes(tag.toLowerCase())
                ) ||
                item.category?.toLowerCase() === "chicken" ||
                /chicken|beef|mutton|fish/i.test(item.name);

            return {
                name: item.name,
                slug: item.slug || item.id,
                description: item.description || "",
                price: Number(item.price) || 0,
                category: item.category || "General",
                foodType: isNonVeg ? "non-veg" : "veg",
                isAvailable: true,
                image: item.image,
                tags: item.tags || [],
            };
        });

        console.log(`📦 Transformed ${formattedProducts.length} items for insertion...`);

        const inserted = await Product.insertMany(formattedProducts);
        console.log(`🎉 Successfully seeded ${inserted.length} products into the database!`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("❌ Product Seeding Failed:", error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedProducts();