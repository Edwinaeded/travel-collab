'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Destination extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Destination.belongsTo(models.Trip, { foreignKey: 'tripId' })
      Destination.hasMany(models.Comment, { foreignKey: 'destinationId' })
    }
  }
  Destination.init({
    tripId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    date: DataTypes.DATE,
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME,
    cost: DataTypes.STRING,
    address: DataTypes.STRING,
    image: DataTypes.STRING,
    latitude: DataTypes.DECIMAL(10, 8),
    longitude: DataTypes.DECIMAL(11, 8)
  }, {
    sequelize,
    modelName: 'Destination',
    tableName: 'Destinations',
    underscored: true
  })
  return Destination
}
