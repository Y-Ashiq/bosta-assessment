import borrowSchema from "../database/models/borrow.model.js";
import bookSchema from "../database/models/book.model.js";
import userSchema from "../database/models/user.model.js";
import { Op } from "sequelize";
import { Parser as Json2CsvParser } from "json2csv";
import XLSX from "xlsx";

// Get borrowing analytics for a specific period
export async function getBorrowingAnalytics(startDate, endDate) {
  const borrows = await borrowSchema.findAll({
    where: {
      checkoutDate: {
        [Op.gte]: new Date(startDate),
        [Op.lte]: new Date(endDate),
      },
    },
    include: [bookSchema, userSchema],
  });
  return borrows;
}

// Export borrowing data to CSV
export function exportToCSV(data) {
  const fields = [
    "id",
    "bookId",
    "borrowerId",
    "checkoutDate",
    "dueDate",
    "returned",
  ];
  const json2csvParser = new Json2CsvParser({ fields });
  return json2csvParser.parse(data);
}

// Export borrowing data to XLSX
export function exportToXLSX(data) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Borrows");
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}

// Get all overdue borrows of the last month
export async function getOverdueBorrowsLastMonth() {
  const now = new Date();
  const lastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );
  return await borrowSchema.findAll({
    where: {
      dueDate: { [Op.lt]: now, [Op.gte]: lastMonth },
      returned: false,
    },
    include: [bookSchema, userSchema],
  });
}

// Get all borrowing processes of the last month
export async function getBorrowsLastMonth() {
  const now = new Date();
  const lastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );
  return await borrowSchema.findAll({
    where: {
      checkoutDate: { [Op.gte]: lastMonth, [Op.lte]: now },
    },
    include: [bookSchema, userSchema],
  });
}
