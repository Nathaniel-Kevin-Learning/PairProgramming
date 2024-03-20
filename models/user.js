'use strict';
const {bcryptData} = require("../helper")
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserDetail, {foreignKey:"UserId"});
      User.hasMany(models.Post,{foreignKey:"UserId"})
    }
  }
  User.init({
    email: {
      type:DataTypes.STRING,
      allowNull: false, 
      unique: {
        msg: "Email must be unique"
      }, 
      validate: {
        notEmpty: {
          msg: "email is required"
        },notNull:{
          msg: "email is required"
        }, 
        isEmail: true, 
      }
    },
    password: {
      type:DataTypes.STRING,
      allowNull: false, 
      validate: {
        notEmpty: {
          msg: "password is required"
        },notNull:{
          msg: "password is required"
        }, 
        lessThanMinimal(value){
          if(value.length < 8){
            throw new Error("The minimal length of password is 8")
          }
        }, 
      }
    },
    role: {
      type:DataTypes.STRING,
      allowNull: false, 
      validate: {
        notEmpty: {
          msg: "role is required"
        },notNull:{
          msg: "role is required"
        }, 
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks:{
      afterValidate:(user, options)=>{
        user.password = bcryptData(user.password)
      }
    }
  });
  return User;
};