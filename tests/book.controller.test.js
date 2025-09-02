import { jest } from '@jest/globals';
import bookcontrollers from "../src/modules/bookModule/book.controller.js";
import bookSchema from "../src/database/models/book.model.js";

describe("Book Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("addBook should throw error if book already exists", async () => {
    const req = {
      body: {
        ISBN: "123",
        title: "Test",
        author: "Author",
        availableQuantity: 1,
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    jest.spyOn(bookSchema, 'create').mockImplementationOnce(() => {
      throw { name: "SequelizeUniqueConstraintError" };
    });
    await bookcontrollers.addBook(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("getAllBook should return books", async () => {
    const req = { query: {} };
    const res = { json: jest.fn() };
    const next = jest.fn();
    jest.spyOn(bookSchema, 'findAll').mockResolvedValueOnce([{ title: "Test Book" }]);
    await bookcontrollers.getAllBook(req, res, next);
    expect(res.json).toHaveBeenCalledWith([{ title: "Test Book" }]);
  });
});