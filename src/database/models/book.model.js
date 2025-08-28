import { DataTypes } from "sequelize";
import sequelize from "../DBconnection.js";

const bookSchema = sequelize.define("book", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ISBN: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  availableQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  shelfLocation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default bookSchema;
