import borrowerSchema from "../../database/models/user.model.js";
import bookSchema from "../../database/models/book.model.js";
import borrowSchema from "../../database/models/borrow.model.js";
import { handleError } from "../../middleware/handleError.js";
import { AppError } from "../../util/AppError.js";
import { Op } from "sequelize";
import { Parser as Json2CsvParser } from "json2csv";

const borrowBook = handleError(async (req, res, next) => {
  const { bookId, borrowerId, dueDate } = req.body;
  if (!bookId || !borrowerId || !dueDate) {
    return next(new AppError("Missing required fields", 400));
  }
  const book = await bookSchema.findByPk(bookId);
  if (!book || book.availableQuantity < 1) {
    return next(new AppError("Book not found or not available", 404));
  }
  const borrower = await borrowerSchema.findByPk(borrowerId);
  if (!borrower) {
    return next(new AppError("Borrower not found", 404));
  }
  await borrowSchema.create({
    bookId,
    borrowerId,
    checkoutDate: new Date(),
    dueDate,
    returned: false,
  });
  await bookSchema.update(
    { availableQuantity: book.availableQuantity - 1 },
    { where: { id: bookId } }
  );
  res.json({ message: "Book borrowed successfully" });
});

const returnBook = handleError(async (req, res, next) => {
  const { borrowId } = req.body;
  if (!borrowId) {
    return next(new AppError("Missing borrowId", 400));
  }
  const borrow = await borrowSchema.findByPk(borrowId);
  if (!borrow || borrow.returned) {
    return next(new AppError("No active borrow record found", 404));
  }
  await borrowSchema.update({ returned: true }, { where: { id: borrowId } });
  const book = await bookSchema.findByPk(borrow.bookId);
  await bookSchema.update(
    { availableQuantity: book.availableQuantity + 1 },
    { where: { id: book.id } }
  );
  res.json({ message: "Book returned successfully" });
});

const getBorrowerBooks = handleError(async (req, res, next) => {
  const borrowerId = req.params.id;
  const borrows = await borrowSchema.findAll({
    where: { borrowerId, returned: false },
    include: [bookSchema],
  });
  res.json(borrows);
});

const getOverdueBooks = handleError(async (req, res, next) => {
  const now = new Date();
  const overdue = await borrowSchema.findAll({
    where: {
      dueDate: { [Op.lt]: now },
      returned: false,
    },
    include: [bookSchema, borrowerSchema],
  });
  res.json(overdue);
});

const getBorrowingAnalytics = handleError(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const borrows = await borrowSchema.findAll({
    where: {
      checkoutDate: {
        [Op.gte]: new Date(startDate),
        [Op.lte]: new Date(endDate),
      },
    },
    include: [bookSchema, borrowerSchema],
  });
  res.json(borrows);
});

const exportOverdueLastMonth = handleError(async (req, res, next) => {
  const now = new Date();
  const lastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );
  const data = await borrowSchema.findAll({
    where: {
      dueDate: { [Op.lt]: now, [Op.gte]: lastMonth },
      returned: false,
    },
    include: [bookSchema, borrowerSchema],
  });
  const fields = [
    "id",
    "bookId",
    "borrowerId",
    "checkoutDate",
    "dueDate",
    "returned",
  ];
  const json2csvParser = new Json2CsvParser({ fields });
  const csv = json2csvParser.parse(data);
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=overdue_last_month.csv"
  );
  res.type("text/csv");
  res.send(csv);
});

const exportBorrowsLastMonth = handleError(async (req, res, next) => {
  const now = new Date();
  const lastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );
  const data = await borrowSchema.findAll({
    where: {
      checkoutDate: { [Op.gte]: lastMonth, [Op.lte]: now },
    },
    include: [bookSchema, borrowerSchema],
  });
  const fields = [
    "id",
    "bookId",
    "borrowerId",
    "checkoutDate",
    "dueDate",
    "returned",
  ];
  const json2csvParser = new Json2CsvParser({ fields });
  const csv = json2csvParser.parse(data);
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=borrows_last_month.csv"
  );
  res.type("text/csv");
  res.send(csv);
});

export default {
  borrowBook,
  returnBook,
  getBorrowerBooks,
  getOverdueBooks,
  getBorrowingAnalytics,
  exportOverdueLastMonth,
  exportBorrowsLastMonth,
};
