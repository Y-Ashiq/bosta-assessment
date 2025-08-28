import userSchema from "../database/models/user.model.js";
import bcrypt from "bcrypt";

export const cehckUser = async (req, res, next) => {
  let { userName } = req.body;

  let isExist = await userSchema.findOne({ where: { userName } });

  if (isExist) {
    res.json({ message: " this userName is already exist" });
  } else {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    next();
  }
};