import { AppError } from "../util/AppError.js";

export const handleError = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      // If it's already an AppError, pass it through
      if (error instanceof AppError) {
        return next(error);
      }

      // If it's a validation error or other known error, create appropriate AppError
      if (error.name === "SequelizeValidationError") {
        return next(new AppError(error.message, 400));
      }

      if (error.name === "SequelizeUniqueConstraintError") {
        return next(new AppError("Resource already exists", 409));
      }

      // For unknown errors, create a generic error
      return next(new AppError(error.message || "Internal server error", 500));
    });
  };
};
