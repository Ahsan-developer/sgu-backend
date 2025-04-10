import { Request, Response } from "express";
import {
  getAllUsers,
  createUser,
  getUserService,
  updateUserService,
  deleteUserService,
  updateProfilePictureService,
} from "../services/userService";
import { AuthenticatedRequest, AuthenticatedUserRequest } from "../types";

/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: Retrieve all users
 *     description: Fetch a list of all registered users. Requires an API token for authentication.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   username:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [active, inactive, suspended]
 *                   role:
 *                     type: string
 *                     enum: [admin, moderator, user]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized - No token provided or invalid token.
 *       500:
 *         description: Server error.
 */
export const fetchAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user with the provided details.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - username
 *               - registrationID
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               registrationID:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, moderator, user]
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *       400:
 *         description: Error registering user
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({
      message: "User registered successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /user/me
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
export const getUser = async (req: AuthenticatedUserRequest, res: Response) => {
  console.log(req?.user);
  if (req.user) {
    try {
      const user = await getUserService(req?.user?.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  }
};

/**
 * @swagger
 * /user/update/{id}:
 *   put:
 *     summary: Update user details
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = await updateUserService(req.params.id, req.body);
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

/**
 * @swagger
 * /user/delete/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deleted = await deleteUserService(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

/**
 * @swagger
 * /user/upload-profile:
 *   post:
 *     summary: Upload a profile picture
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *       400:
 *         description: Invalid file format or size
 */
export const uploadProfilePicture = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthenticatedRequest;
  try {
    if (!authReq.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    const userId = authReq?.user?.id ?? "";
    const file = authReq.file as Express.MulterS3.File; // Type assertion
    const imageUrl = file.location;

    // Update user profile with image URL
    const updatedUser = await updateProfilePictureService(userId, imageUrl);
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile picture uploaded successfully", imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};
