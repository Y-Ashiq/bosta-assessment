import bookSchema from "./book.model.js";
import borrowSchema from "./borrow.model.js";
import borrowerSchema from "./user.model.js";

bookSchema.hasMany(borrowSchema, {
  foreignKey: "bookId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
borrowSchema.belongsTo(bookSchema, { foreignKey: "bookId" });

borrowerSchema.hasMany(borrowSchema, {
  foreignKey: "borrowerId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
borrowSchema.belongsTo(borrowerSchema, { foreignKey: "borrowerId" });
