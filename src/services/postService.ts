import PostModel, { IPost } from "../models/postModel";

export const createPost = async (postData: Partial<IPost>): Promise<IPost> => {
  return await PostModel.create(postData);
};

export const getAllPosts = async (): Promise<IPost[]> => {
  return await PostModel.find().populate("creatorId", "name email");
};

export const getUserPosts = async (userId: string): Promise<IPost[]> => {
  return await PostModel.find({ creatorId: userId });
};

export const getPostById = async (postId: string): Promise<IPost | null> => {
  return await PostModel.findById(postId).populate("creatorId", "name email");
};

export const updatePost = async (
  postId: string,
  updateData: Partial<IPost>
): Promise<IPost | null> => {
  return await PostModel.findByIdAndUpdate(postId, updateData, { new: true });
};

export const deletePost = async (postId: string): Promise<IPost | null> => {
  return await PostModel.findByIdAndDelete(postId);
};
