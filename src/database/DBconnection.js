import { Sequelize } from "sequelize";

const sequelize = new Sequelize("library", "postgres", "postgres", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) => {
    console.log("error" + error);
  });

export default sequelize;
