import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const UsersModel = sequelize.define("user", {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
});

export default UsersModel;
