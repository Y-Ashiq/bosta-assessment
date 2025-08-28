# Library Management System API Documentation

## Overview

This project provides a comprehensive REST API for managing a library system, including books, borrowers, and borrowing processes. The API is documented using Swagger/OpenAPI 3.0 specification.

## Features

### 1. Books Management

- **Add a book** with details like title, author, ISBN, available quantity, and shelf location
- **Update a book's** details
- **Delete a book** from the system
- **List all books** or search by title, author, or ISBN

### 2. Borrower Management

- **Register a borrower** with name and email
- **Update borrower's** details
- **Delete a borrower** from the system
- **List all borrowers**

### 3. Borrowing Process

- **Check out a book** - track which books are borrowed and by whom
- **Return a book** - update the system when books are returned
- **Check borrower's current books** - see what books a borrower currently has
- **Track overdue books** - monitor books that are past their due date

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL or PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd libraryAPIs-master
```

2. Install dependencies:

```bash
npm install
```

3. Configure your database connection in `src/database/DBconnection.js`

4. Start the server:

```bash
npm start
```

The server will start on `http://localhost:3000`

## API Documentation

### Accessing Swagger Documentation

Once the server is running, you can access the interactive API documentation at:

**http://localhost:3000/api-docs**

This will open the Swagger UI where you can:

- View all available endpoints
- Test API calls directly from the browser
- See request/response schemas
- Understand the API structure

### API Base URL

All API endpoints are prefixed with `/API`:

- Books: `/API/books/`
- Users/Borrowers: `/API/users/`
- Borrowing: `/API/borrow/`

## API Endpoints

### Books

| Method | Endpoint               | Description                      |
| ------ | ---------------------- | -------------------------------- |
| GET    | `/API/books/books`     | Get all books or search by query |
| POST   | `/API/books/books`     | Add a new book                   |
| PUT    | `/API/books/books/:id` | Update a book                    |
| DELETE | `/API/books/books/:id` | Delete a book                    |

### Borrowers

| Method | Endpoint                   | Description             |
| ------ | -------------------------- | ----------------------- |
| POST   | `/API/users/borrowers`     | Register a new borrower |
| PUT    | `/API/users/borrowers/:id` | Update borrower details |
| DELETE | `/API/users/borrowers/:id` | Delete a borrower       |
| GET    | `/API/users/borrowers`     | List all borrowers      |

### Borrowing Process

| Method | Endpoint                         | Description                  |
| ------ | -------------------------------- | ---------------------------- |
| POST   | `/API/borrow/borrow`             | Borrow a book                |
| POST   | `/API/borrow/return`             | Return a book                |
| GET    | `/API/borrow/borrower/:id/books` | Get borrower's current books |
| GET    | `/API/borrow/books/overdue`      | Get overdue books            |

## Example Usage

### Adding a Book

```bash
curl -X POST http://localhost:3000/API/books/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "ISBN": "978-0743273565",
    "availableQuantity": 5,
    "shelfLocation": "Fiction Section A-1"
  }'
```

### Registering a Borrower

```bash
curl -X POST http://localhost:3000/API/users/borrowers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com"
  }'
```

### Borrowing a Book

```bash
curl -X POST http://localhost:3000/API/borrow/borrow \
  -H "Content-Type: application/json" \
  -d '{
    "borrowerId": 1,
    "bookId": 1
  }'
```

## Data Models

### Book Schema

```json
{
  "id": "integer",
  "title": "string (required)",
  "author": "string (required)",
  "ISBN": "string (required)",
  "availableQuantity": "integer (required, min: 0)",
  "shelfLocation": "string (required)",
  "createdAt": "date-time",
  "updatedAt": "date-time"
}
```

### Borrower Schema

```json
{
  "id": "integer",
  "name": "string (required)",
  "email": "string (required, email format)",
  "registeredDate": "date-time",
  "createdAt": "date-time",
  "updatedAt": "date-time"
}
```

### Borrow Record Schema

```json
{
  "id": "integer",
  "borrowerId": "integer",
  "bookId": "integer",
  "borrowDate": "date-time",
  "dueDate": "date-time",
  "returnDate": "date-time (nullable)",
  "status": "string (borrowed|returned|overdue)"
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200` - Success
- `400` - Bad Request (missing required fields)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

Error responses follow this format:

```json
{
  "message": "error",
  "error": "Detailed error description"
}
```

## Testing the API

1. **Start the server**: `npm start`
2. **Open Swagger UI**: Navigate to `http://localhost:3000/api-docs`
3. **Test endpoints**: Use the interactive interface to test all API calls
4. **View schemas**: Check the data models and response formats

## Development

### Project Structure

```
src/
├── config/
│   └── swagger.js          # Swagger configuration
├── database/
│   ├── DBconnection.js     # Database connection
│   └── models/             # Data models
├── middleware/              # Custom middleware
├── modules/                 # Feature modules
│   ├── bookModule/         # Book management
│   ├── borrowModule/       # Borrowing process
│   └── userModule/         # User/borrower management
└── util/                   # Utility functions
```

### Adding New Endpoints

To add new endpoints with Swagger documentation:

1. Add the route to the appropriate module
2. Include JSDoc comments with `@swagger` annotations
3. Follow the existing documentation pattern
4. Update the Swagger configuration if needed

## Support

For questions or issues:

- Check the Swagger documentation at `/api-docs`
- Review the error messages and status codes
- Ensure all required fields are provided in requests

## License

This project is licensed under the ISC License.
