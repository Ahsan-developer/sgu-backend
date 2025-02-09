import User from "../models/userModel";
import bcrypt from "bcryptjs";

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const getAllUsers = async () => {
  return await User.find();
};
export const createUser = async (userData: any) => {
  const { email, password, registrationID, ...rest } = userData;

  // Check if all required fields are provided
  if (!email || !password || !registrationID) {
    throw new Error("Email, password, and registrationID are required.");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format.");
  }

  // Check if registrationID starts with A0 (case-insensitive)
  const registrationIDRegex = /^A0/i;
  if (!registrationIDRegex.test(registrationID)) {
    throw new Error("registrationID must start with 'A0'.");
  }

  // Check if user with the same email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email is already in use.");
  }

  // Check if registrationID is unique
  const existingRegistrationID = await User.findOne({ registrationID });
  if (existingRegistrationID) {
    throw new Error("registrationID is already in use.");
  }

  // Ensure password length
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  try {
    // Create a new user
    const user = new User({
      ...rest,
      email,
      password,
      registrationID,
    });

    // Save user to the database
    await user.save();

    return user;
  } catch (error: any) {
    // Handle database errors
    throw new Error(`Failed to create user: ${error.message}`);
  }
};
