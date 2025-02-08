import User from "../models/userModel";

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const getAllUsers = async () => {
  return await User.find();
};

export const createUser = async (name: string, email: string) => {
  const user = new User({ name, email });
  return await user.save();
};
