import express from "express";
import sequelize from "./src/database/DBconnection.js";
import { bootStrap } from "./src/util/Bootstrap.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/util/swagger.js";
import "./src/database/models/associations.js";

const app = express();
const port = 3000;

sequelize.sync();

app.use(express.json());

// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

bootStrap(app);

app.use("*", (req, res, next) => {
  res.status(404).json({ message: "not found URL" });
});

// Global error handling middleware
app.use((err, req, res, next) => {

  // Check if it's our custom AppError
  if (err.statusCode) {
    res.status(err.statusCode).json({
      message: "error",
      error: err.message,
    });
  } else {
    // Handle regular errors
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
