'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Trip.hasMany(models.Destination, { foreignKey: 'tripId' })
      Trip.belongsTo(models.User, { foreignKey: 'userId' })
      Trip.belongsToMany(models.User, {
        through: models.Share,
        foreignKey: 'tripId',
        otherKey: 'userId',
        as: 'Sharers'
      })
      Trip.belongsToMany(models.User, {
        through: models.Share,
        foreignKey: 'tripId',
        otherKey: 'sharedUserId',
        as: 'Receivers'
      })
    }
  }
  Trip.init({
    name: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Trip',
    tableName: 'Trips',
    underscored: true
  })
  return Trip
}
