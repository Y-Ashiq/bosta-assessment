import { AppError } from "../util/AppError.js";
import Joi from "joi";
import DOMPurify from "isomorphic-dompurify";

// Input sanitization function
export const sanitizeInput = (input) => {
  if (typeof input === "string") {
    return DOMPurify.sanitize(input.trim());
  }
  if (typeof input === "object" && input !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  return input;
};

// Book validation schema
export const bookValidationSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(255)
    .pattern(/^[a-zA-Z0-9\s\-_.,!?'"()]+$/)
    .required()
    .messages({
      "string.pattern.base": "Title contains invalid characters",
      "string.empty": "Title cannot be empty",
      "string.max": "Title cannot exceed 255 characters",
    }),
  author: Joi.string()
    .min(1)
    .max(255)
    .pattern(/^[a-zA-Z\s\-']+$/)
    .required()
    .messages({
      "string.pattern.base": "Author name contains invalid characters",
      "string.empty": "Author cannot be empty",
      "string.max": "Author name cannot exceed 255 characters",
    }),
  ISBN: Joi.number().integer().required().messages({
    "integer.min": "ISBN must be at least 10 numbers",
    "integer.max": "ISBN cannot exceed 13 numbers",
  }),
  availableQuantity: Joi.number()
    .integer()
    .min(0)
    .max(1000)
    .required()
    .messages({
      "number.base": "Available quantity must be a number",
      "number.integer": "Available quantity must be a whole number",
      "number.min": "Available quantity cannot be negative",
      "number.max": "Available quantity cannot exceed 1000",
    }),
  shelfLocation: Joi.string().min(1).max(100).required().messages({
    "string.pattern.base": "Shelf location contains invalid characters",
    "string.empty": "Shelf location cannot be empty",
    "string.max": "Shelf location cannot exceed 100 characters",
  }),
});

// Book update validation schema (all fields optional, but validated if present)
export const bookUpdateValidationSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(255)
    .pattern(/^[a-zA-Z0-9\s\-_.,!?'"()]+$/)
    .messages({
      "string.pattern.base": "Title contains invalid characters",
      "string.max": "Title cannot exceed 255 characters",
    }),
  author: Joi.string()
    .min(1)
    .max(255)
    .pattern(/^[a-zA-Z\s\-']+$/)
    .messages({
      "string.pattern.base": "Author name contains invalid characters",
      "string.max": "Author name cannot exceed 255 characters",
    }),
  ISBN: Joi.number().integer().messages({
    "integer.min": "ISBN must be at least 10 numbers",
    "integer.max": "ISBN cannot exceed 13 numbers",
  }),
  availableQuantity: Joi.number().integer().min(0).max(1000).messages({
    "number.base": "Available quantity must be a number",
    "number.integer": "Available quantity must be a whole number",
    "number.min": "Available quantity cannot be negative",
    "number.max": "Available quantity cannot exceed 1000",
  }),
  shelfLocation: Joi.string().min(1).max(100).messages({
    "string.pattern.base": "Shelf location contains invalid characters",
    "string.max": "Shelf location cannot exceed 100 characters",
  }),
});

// User validation schema
export const userValidationSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    "string.pattern.base": "Name contains invalid characters",
    "string.empty": "Name cannot be empty",
    "string.max": "Name cannot exceed 100 characters",
  }),
  email: Joi.string().email().max(255).required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email cannot be empty",
    "string.max": "Email cannot exceed 255 characters",
  }),
  registeredDate: Joi.date().default(() => new Date()),
});

// Borrow validation schema
export const borrowValidationSchema = Joi.object({
  bookId: Joi.number().integer().positive().required().messages({
    "number.base": "Book ID must be a number",
    "number.integer": "Book ID must be a whole number",
    "number.positive": "Book ID must be positive",
  }),
  borrowerId: Joi.number().integer().positive().required().messages({
    "number.base": "Borrower ID must be a number",
    "number.integer": "Borrower ID must be a whole number",
    "number.positive": "Borrower ID must be positive",
  }),
  dueDate: Joi.date().greater("now").required().messages({
    "date.base": "Due date must be a valid date",
    "date.greater": "Due date must be in the future",
  }),
});

// Generic validation middleware
export const validateInput = (schema) => {
  return (req, res, next) => {
    // Sanitize input first
    req.body = sanitizeInput(req.body);
    req.query = sanitizeInput(req.query);
    req.params = sanitizeInput(req.params);

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return next(
        new AppError(`Validation failed: ${errorMessages.join(", ")}`, 400)
      );
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

// Search query validation
export const validateSearchQuery = (req, res, next) => {
  const { query } = req.query;

  if (query) {
    // Sanitize search query
    const sanitizedQuery = sanitizeInput(query);

    // Validate search query length
    if (sanitizedQuery.length > 100) {
      return next(
        new AppError("Search query too long (max 100 characters)", 400)
      );
    }

    req.query.query = sanitizedQuery;
  }

  next();
};

// ID parameter validation
export const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
    return next(new AppError("Invalid ID parameter", 400));
  }

  // Ensure ID is within reasonable bounds
  if (parseInt(id) > 999999999) {
    return next(new AppError("ID parameter too large", 400));
  }

  req.params.id = parseInt(id);
  next();
};
