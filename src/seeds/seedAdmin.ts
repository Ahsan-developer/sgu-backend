import User from "../models/userModel";
import bcrypt from "bcryptjs";

const seedAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }

    const adminPassword = "admin123456";

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = new User({
      username: "admin",
      name: "Admin User",
      email: "admin@example.com",
      registrationID: "ADM-0001",
      password: hashedPassword,
      status: "active",
      role: "admin",
      isEmailVerified: true,
      preferences: {
        theme: "light",
        notifications: true,
      },
      loginAttempts: 0,
    });

    await adminUser.save();
    console.log("✅ Admin user seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
  }
};

export default seedAdminUser;
