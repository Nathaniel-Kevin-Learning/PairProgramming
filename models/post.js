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
    title: DataTypes.STRING,
    shortDescription: DataTypes.TEXT,
    image: DataTypes.STRING,
    content: DataTypes.TEXT,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};