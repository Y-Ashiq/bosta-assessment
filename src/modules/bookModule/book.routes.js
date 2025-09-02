import { Router } from "express";
import bookcontrollers from "./book.controller.js";
import {
  validateInput,
  validateSearchQuery,
  validateId,
  bookValidationSchema,
  bookUpdateValidationSchema,
} from "../../middleware/validation.js";

const bookRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Book
 *   description: Book management operations
 */

/**
 * @swagger
 * /API/books/getbooks:
 *   get:
 *     summary: Get all books or search books
 *     tags: [Book]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search term for title, author, or ISBN
 *     responses:
 *       200:
 *         description: List of books
 */
bookRouter.get("/getbooks", validateSearchQuery, bookcontrollers.getAllBook);

/**
 * @swagger
 * /API/books/addbooks:
 *   post:
 *     summary: Add a new book
 *     tags: [Book]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               ISBN:
 *                 type: string
 *               availableQuantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Book added successfully
 *       409:
 *         description: Book with this ISBN already exists
 *       500:
 *         description: Failed to add book
 */
bookRouter.post(
  "/addbooks",
  validateInput(bookValidationSchema),
  bookcontrollers.addBook
);

/**
 * @swagger
 * /API/books/updatebooks/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Book]
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
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               ISBN:
 *                 type: string
 *               availableQuantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Book has been updated
 *       404:
 *         description: No book found
 *       409:
 *         description: Book with this ISBN already exists
 *       500:
 *         description: Failed to update book
 */
bookRouter.put(
  "/updatebooks/:id",
  validateId,
  validateInput(bookUpdateValidationSchema),
  bookcontrollers.updateBook
);

/**
 * @swagger
 * /API/books/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Book]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book has been deleted
 *       404:
 *         description: No book found
 *       500:
 *         description: Failed to delete book
 */
bookRouter.delete("/books/:id", validateId, bookcontrollers.deleteBook);

export default bookRouter;
