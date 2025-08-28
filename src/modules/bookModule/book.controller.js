import bookSchema from "../../database/models/book.model.js";
import { AppError } from "../../util/AppError.js";
import { handleError } from "../../middleware/handleError.js";
import { Op } from "sequelize";

const addBook = handleError(async (req, res, next) => {
  try {
    const book = await bookSchema.create(req.body);
    res.status(201).json({ message: "Book added successfully", book });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return next(new AppError("Book with this ISBN already exists", 409));
    }
    return next(new AppError("Failed to add book", 500));
  }
});

const getAllBook = handleError(async (req, res, next) => {
  const query = req.query.query;
  if (query) {
    const books = await bookSchema.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { author: { [Op.like]: `%${query}%` } },
          { ISBN: { [Op.like]: `%${query}%` } },
        ],
      },
    });
    return res.json(books);
  }
  const books = await bookSchema.findAll();
  res.json(books);
});

const updateBook = handleError(async (req, res, next) => {
  const findBook = await bookSchema.findByPk(req.params.id);
  if (!findBook) {
    return next(new AppError("No book found", 404));
  }
  try {
    await bookSchema.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Book has been updated" });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return next(new AppError("Book with this ISBN already exists", 409));
    }
    return next(new AppError("Failed to update book", 500));
  }
});

const deleteBook = handleError(async (req, res, next) => {
  const findBook = await bookSchema.findByPk(req.params.id);
  if (!findBook) {
    return next(new AppError("No book found", 404));
  }
  try {
    await bookSchema.destroy({ where: { id: req.params.id } });
    res.json({ message: "Book has been deleted" });
  } catch (err) {
    return next(new AppError("Failed to delete book", 500));
  }
});

export default { addBook, updateBook, deleteBook, getAllBook };
