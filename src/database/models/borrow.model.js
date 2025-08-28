import { DataTypes } from "sequelize";
import sequelize from "../DBconnection.js";

const borrowSchema = sequelize.define("borrow", {
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  borrowerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  checkoutDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  returned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default borrowSchema;
