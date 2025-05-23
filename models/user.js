'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      User.hasMany(models.Trip, { foreignKey: 'userId' })
      User.hasMany(models.Comment, { foreignKey: 'userId' })
      User.belongsToMany(models.Trip, {
        through: models.Share,
        foreignKey: 'userId',
        as: 'SharedTrips'
      })
      User.belongsToMany(models.Trip, {
        through: models.Share,
        foreignKey: 'sharedUserId',
        as: 'ReceivedTrips'
      })
    }
  }
  User.init({
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    image: DataTypes.STRING,
    shareId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
