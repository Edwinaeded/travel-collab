'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Destinations', 'latitude', {
      type: Sequelize.DECIMAL(10, 8)
    })

    await queryInterface.addColumn('Destinations', 'longitude', {
      type: Sequelize.DECIMAL(11, 8)
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Destinations', 'latitude')
    await queryInterface.removeColumn('Destinations', 'longitude')
  }
}
