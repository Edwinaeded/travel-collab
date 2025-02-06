'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Share extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  Share.init({
    userId: DataTypes.INTEGER,
    tripId: DataTypes.INTEGER,
    sharedUserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Share',
    tableName: 'Shares',
    underscored: true
  })
  return Share
}
