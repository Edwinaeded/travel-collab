'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    const trips = await queryInterface.sequelize.query('SELECT id FROM Trips;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    await queryInterface.bulkInsert('Shares', [
      {
        user_id: users[0].id,
        trip_id: trips[0].id,
        shared_user_id: users[1].id,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Shares', null, {})
  }
}
