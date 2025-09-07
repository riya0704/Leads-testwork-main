// 1. Load dotenv at the very top
require("dotenv").config();

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Lead = require("./models/leadModel"); // adjust path if needed

// 2. Use env variable
const MONGODB = process.env.MONGODB;

// 3. Safety check
if (!MONGODB) {
  console.error("❌ MONGODB is not defined in .env file!");
  process.exit(1);
}

// 4. Connect to MongoDB
mongoose.connect(MONGODB)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// 5. Function to generate dummy leads
async function generateDummyLeads(num = 50) {
  const leads = [];
  for (let i = 0; i < num; i++) {
    leads.push({
      name: faker.person.fullName(),
      email: `dummy${Date.now()}${i}@gmail.com`,
      phone: faker.phone.number("9#########"),
      feedback: faker.lorem.sentence(),
      status: Math.random() < 0.5 ? "New" : "Contacted",
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  try {
    await Lead.insertMany(leads);
    console.log(`✅ ${num} dummy leads inserted successfully!`);
    mongoose.connection.close();
  } catch (err) {
    console.error("Error inserting dummy leads:", err);
  }
}

// 6. Generate leads
generateDummyLeads(50);
