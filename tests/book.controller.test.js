import bookcontrollers from "../../src/modules/bookModule/book.controller.js";

describe("Book Controller", () => {
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
    // Simulate SequelizeUniqueConstraintError
    bookcontrollers.addBook.mockImplementationOnce(() => {
      throw { name: "SequelizeUniqueConstraintError" };
    });
    await bookcontrollers.addBook(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("getAllBook should return books", async () => {
    const req = { query: {} };
    const res = { json: jest.fn() };
    const next = jest.fn();
    await bookcontrollers.getAllBook(req, res, next);
    expect(res.json).toHaveBeenCalled();
  });
});
