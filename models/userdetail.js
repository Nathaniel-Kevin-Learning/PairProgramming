'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserDetail.belongsTo(models.User, {foreignKey:"UserId"})
    }

    get nameAge(){
      let data = `${this.fullName} - ${this.age ? this.age : "not filled yet"}`;
      return data
    }
  }
  UserDetail.init({
    fullName: {
      type:DataTypes.STRING,
      allowNull: false, 
      validate: {
        notEmpty: {
          msg: "fullName is required"
        },notNull:{
          msg: "fullName is required"
        }, 
      }
    },
    address: DataTypes.STRING,
    gender: DataTypes.STRING,
    age: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserDetail',
  });
  return UserDetail;
};