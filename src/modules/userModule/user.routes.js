import { Router } from "express";
import userControllers from "./user.controller.js";
import {
  validateInput,
  validateId,
  userValidationSchema,
} from "../../middleware/validation.js";

const userRouter = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Borrower management operations
 */

/**
 * @swagger
 * /API/users/borrowers:
 *   post:
 *     summary: Register a new borrower
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Borrower registered successfully
 *       400:
 *         description: Missing name or email
 *       409:
 *         description: Borrower already exists
 */
userRouter.post(
  "/borrowers",
  validateInput(userValidationSchema),
  userControllers.registerBorrower
);
/**
 * @swagger
 * /API/users/borrowers/{id}:
 *   put:
 *     summary: Update a borrower
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Borrower updated successfully
 *       404:
 *         description: No borrower found
 */
userRouter.put(
  "/borrowers/:id",
  validateId,
  validateInput(userValidationSchema),
  userControllers.updateBorrower
);
/**
 * @swagger
 * /API/users/borrowers/{id}:
 *   delete:
 *     summary: Delete a borrower
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Borrower deleted successfully
 *       404:
 *         description: No borrower found
 */
userRouter.delete("/borrowers/:id", validateId, userControllers.deleteBorrower);
/**
 * @swagger
 * /API/users/borrowers:
 *   get:
 *     summary: List all borrowers
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of borrowers
 */
userRouter.get("/borrowers", userControllers.listBorrowers);

export default userRouter;
