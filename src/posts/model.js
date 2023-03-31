import { DataTypes } from "sequelize";
import CommentsModel from "../comments/model.js";
import sequelize from "../db.js";

const PostsModel = sequelize.define("post", {
  postId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

PostsModel.hasMany(CommentsModel, {
  foreignKey: { name: "postId", allowNull: false },
});
CommentsModel.belongsTo(PostsModel, {
  foreignKey: { name: "postId", allowNull: false },
});

export default PostsModel;
