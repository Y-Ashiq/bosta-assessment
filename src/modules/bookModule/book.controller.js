import bookSchema from "../../database/models/book.model.js";
import { AppError } from "../../util/AppError.js";
import { handleError } from "../../middleware/handleError.js";
import { Op } from "sequelize";

const addBook = handleError(async (req, res, next) => {
  const book = await bookSchema.create(req.body);
  res.status(201).json({ message: "Book added successfully", book });
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
  await bookSchema.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Book has been updated" });
});

const deleteBook = handleError(async (req, res, next) => {
  const findBook = await bookSchema.findByPk(req.params.id);
  if (!findBook) {
    return next(new AppError("No book found", 404));
  }
  await bookSchema.destroy({ where: { id: req.params.id } });
  res.json({ message: "Book has been deleted" });
});

export default { addBook, updateBook, deleteBook, getAllBook };
