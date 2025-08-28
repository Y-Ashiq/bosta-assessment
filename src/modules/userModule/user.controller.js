import borrowerSchema from "../../database/models/user.model.js";
import { AppError } from "../../util/AppError.js";
import { handleError } from "../../middleware/handleError.js";

const registerBorrower = handleError(async (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return next(new AppError("Missing name or email", 400));
  }
  const exists = await borrowerSchema.findOne({ where: { email } });
  if (exists) {
    return next(new AppError("Borrower already exists", 409));
  }
  const borrower = await borrowerSchema.create({ name, email });
  res.json({ message: "Borrower registered successfully", borrower });
});

const updateBorrower = handleError(async (req, res, next) => {
  const borrower = await borrowerSchema.findByPk(req.params.id);
  if (!borrower) {
    return next(new AppError("No borrower found", 404));
  }
  await borrowerSchema.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Borrower updated successfully" });
});

const deleteBorrower = handleError(async (req, res, next) => {
  const borrower = await borrowerSchema.findByPk(req.params.id);
  if (!borrower) {
    return next(new AppError("No borrower found", 404));
  }
  await borrowerSchema.destroy({ where: { id: req.params.id } });
  res.json({ message: "Borrower deleted successfully" });
});

const listBorrowers = handleError(async (req, res, next) => {
  const borrowers = await borrowerSchema.findAll();
  res.json(borrowers);
});

export default {
  registerBorrower,
  updateBorrower,
  deleteBorrower,
  listBorrowers,
};
