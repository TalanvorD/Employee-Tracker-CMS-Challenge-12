const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Role extends Model {} // Model for the Role table

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING
    },
    salary: {
      type: DataTypes.DECIMAL
    },
    department: {
      type: DataTypes.INTEGER
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'role'
  }
);

module.exports = Role;