import bookRourter from "../modules/bookModule/book.routes.js";
import borrowRourter from "../modules/borrowModule/borrow.routes.js";
import userRourter from "../modules/userModule/user.routes.js";

export const bootStrap = (app) => {
  app.use("/API/users/", userRourter);
  app.use("/API/books/", bookRourter);
  app.use("/API/borrow/", borrowRourter);
};
