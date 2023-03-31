import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const CommentsModel = sequelize.define("comment", {
  commentId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export default CommentsModel;
