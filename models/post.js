'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User,{foreignKey:"UserId"})
      Post.belongsToMany(models.Tag,{through: models.PostTag, foreignKey:"PostId", otherKey:"TagId"})
    }
  }
  Post.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull:{
          msg:'title is required'
        },
        notEmpty:{
          msg:'title is required'
        }
      }
    },
    shortDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate:{
        notNull:{
          msg:'shortDescription is required'
        },
        notEmpty:{
          msg:'shortDescription is required'
        },
        maximalWord(value){
          if (value.split(" ").length>50) {
            throw new Error("maximal character is 50 words")
          }
        },
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull:{
          msg:'image is required'
        },
        notEmpty:{
          msg:'image is required'
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate:{
        notNull:{
          msg:'content is required'
        },
        notEmpty:{
          msg:'content is required'
        },
        minimalWord(value){
          if (value.length<10) {
            throw new Error("minimal character content is 10 words")
          }
        }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};