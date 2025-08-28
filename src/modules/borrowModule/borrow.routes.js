import { Router } from "express";
import borrowcontrollers from "./borrow.controller.js";
import {
  validateInput,
  validateId,
  borrowValidationSchema,
} from "../../middleware/validation.js";
import rateLimit from "express-rate-limit";

const borrowRouter = Router();

const borrowLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many borrow requests from this IP, please try again later.",
});

const exportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: "Too many export requests from this IP, please try again later.",
});

/**
 * @swagger
 * tags:
 *   name: Borrow
 *   description: Borrowing operations
 */

/**
 * @swagger
 * /API/borrow/borrow:
 *   post:
 *     summary: Borrow a book
 *     tags: [Borrow]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: integer
 *               borrowerId:
 *                 type: integer
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Book borrowed successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Book or borrower not found
 */
borrowRouter.post(
  "/borrow",
  borrowLimiter,
  validateInput(borrowValidationSchema),
  borrowcontrollers.borrowBook
);
/**
 * @swagger
 * /API/borrow/return:
 *   post:
 *     summary: Return a borrowed book
 *     tags: [Borrow]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               borrowId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       400:
 *         description: Missing borrowId
 *       404:
 *         description: No active borrow record found
 */
borrowRouter.post(
  "/return",
  validateInput(borrowValidationSchema),
  borrowcontrollers.returnBook
);
/**
 * @swagger
 * /API/borrow/borrower/{id}/books:
 *   get:
 *     summary: Get books borrowed by a borrower
 *     tags: [Borrow]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of borrowed books
 *       404:
 *         description: Borrower not found
 */
borrowRouter.get(
  "/borrower/:id/books",
  validateId,
  borrowcontrollers.getBorrowerBooks
);
/**
 * @swagger
 * /API/borrow/books/overdue:
 *   get:
 *     summary: Get overdue books
 *     tags: [Borrow]
 *     responses:
 *       200:
 *         description: List of overdue books
 */
borrowRouter.get("/books/overdue", borrowcontrollers.getOverdueBooks);
/**
 * @swagger
 * /API/borrow/reports/analytics:
 *   get:
 *     summary: Get borrowing analytics
 *     tags: [Borrow]
 *     responses:
 *       200:
 *         description: Borrowing analytics data
 */
borrowRouter.get("/reports/analytics", borrowcontrollers.getBorrowingAnalytics);
/**
 * @swagger
 * /API/borrow/reports/overdue-last-month:
 *   get:
 *     summary: Export all overdue borrows of the last month (CSV)
 *     tags: [Borrow]
 *     produces:
 *       - text/csv
 *     responses:
 *       200:
 *         description: CSV file containing overdue borrows
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
/**
 * @swagger
 * /API/borrow/reports/borrows-last-month:
 *   get:
 *     summary: Export all borrowing processes of the last month (CSV)
 *     tags: [Borrow]
 *     produces:
 *       - text/csv
 *     responses:
 *       200:
 *         description: CSV file containing borrowing processes
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
borrowRouter.get(
  "/reports/overdue-last-month",
  exportLimiter,
  borrowcontrollers.exportOverdueLastMonth
);
borrowRouter.get(
  "/reports/borrows-last-month",
  borrowcontrollers.exportBorrowsLastMonth
);

export default borrowRouter;
