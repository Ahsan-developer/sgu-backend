import User from "../models/userModel";
import bcrypt from "bcryptjs";

const seedAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }

    // const hashedPassword = await bcrypt.hash("your-strong-password", 10);
    const adminUser = new User({
      firstName: "Admin",
      lastName: "User",
      username: "admin",
      email: "admin@example.com",
      registrationID: "ADM-0001",
      password: "your-strong-password",
      status: "active",
      role: "admin",
      isEmailVerified: true,
    });

    await adminUser.save();
    console.log("Admin user seeded successfully.");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};

export default seedAdminUser;
