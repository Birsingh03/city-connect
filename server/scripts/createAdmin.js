import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { configDotenv } from "dotenv";

configDotenv({ path: './.env' });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  isAdmin: { type: Boolean, default: false }
});

const User = mongoose.model("User", userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const adminEmail = "admin@mail.com";
    const adminPassword = "testtest";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin account already exists");
    } else {
      const admin = await User.create({
        username: "admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isAdmin: true
      });
      console.log("Admin account created:", admin.email);
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

createAdmin();
