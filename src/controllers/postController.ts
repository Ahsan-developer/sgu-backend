import { Request, Response } from "express";
import * as postService from "../services/postService";

/**
 * @swagger
 * /posts/create:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *               creatorId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Bad request
 */
export const createPost = async (req: Request, res: Response) => {
  try {
    const post = await postService.createPost(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of all posts
 */
export const getAllPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await postService.getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

/**
 * @swagger
 * /posts/user/{userId}:
 *   get:
 *     summary: Get all posts of a specific user
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user's posts
 */
export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const posts = await postService.getUserPosts(req.params.userId);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Get a single post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post found
 *       404:
 *         description: Post not found
 */
export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await postService.getPostById(req.params.postId);
    post
      ? res.status(200).json(post)
      : res.status(404).json({ message: "Post not found" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

/**
 * @swagger
 * /posts/{postId}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *     responses:
 *       200:
 *         description: Post updated successfully
 */
export const updatePost = async (req: Request, res: Response) => {
  try {
    const post = await postService.updatePost(req.params.postId, req.body);
    post
      ? res.status(200).json(post)
      : res.status(404).json({ message: "Post not found" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 */
export const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await postService.deletePost(req.params.postId);
    post
      ? res.status(200).json({ message: "Post deleted" })
      : res.status(404).json({ message: "Post not found" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
