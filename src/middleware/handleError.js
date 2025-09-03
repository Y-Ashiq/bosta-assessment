import { AppError } from "../util/AppError.js";

export const handleError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      if (error.name === "SequelizeUniqueConstraintError") {
        return next(new AppError("Book with this ISBN already exists", 409));
      }
      
      next(new AppError(error, 401));
    });
  };
};
