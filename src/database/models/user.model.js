import sequelize from "../DBconnection.js";
import { DataTypes } from "sequelize";

const borrowerSchema = sequelize.define("borrower", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  registeredDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

export default borrowerSchema;
