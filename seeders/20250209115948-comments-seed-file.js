'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    const destinations = await queryInterface.sequelize.query('SELECT id FROM Destinations;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    await queryInterface.bulkInsert('Comments', [
      {
        user_id: users[0].id,
        destination_id: destinations[0].id,
        text: '這個時間會塞車嗎？需不需要提早～',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: users[1].id,
        destination_id: destinations[0].id,
        text: '好像有可能耶,我覺得可以提早個1hr',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}
