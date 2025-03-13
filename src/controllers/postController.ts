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
    console.log(req.body, "Form Data");
    console.log(req.file, "Uploaded Image");

    const postData = {
      ...req.body,
      image: req.file?.path, // Save the image path
    };

    const post = await postService.createPost(postData);
    console.log(post, "post");

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get filtered posts
 *     description: Retrieve a list of posts with filtering, sorting, and pagination.
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or content
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter (YYYY-MM-DD)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: "Page number for pagination (default: 1)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Number of results per page (default: 10)"
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: "Field to sort by (default: createdAt)"
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: "Sorting order (asc or desc, default: desc)"
 *     responses:
 *       200:
 *         description: A list of filtered posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPosts:
 *                   type: integer
 *                   example: 50
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "605c72a1f1e5c8b1d4e02a76"
 *                       title:
 *                         type: string
 *                         example: "Understanding Node.js"
 *                       content:
 *                         type: string
 *                         example: "Node.js is a powerful JavaScript runtime..."
 *                       category:
 *                         type: string
 *                         example: "Technology"
 *                       price:
 *                         type: number
 *                         example: 299.99
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-02-26T12:00:00Z"
 *       500:
 *         description: Internal server error
 */
export const getPosts = async (req: Request, res: Response) => {
  try {
    const result = await postService.getFilteredPosts(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

/**
 * @swagger
 * /posts/{userId}:
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
  console.log(req.params.userId, "req.params.userId");

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
    const postData = {
      ...req.body,
      image: req.file?.path, // Save the image path
    };
    const post = await postService.updatePost(req.params.postId, postData);
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
