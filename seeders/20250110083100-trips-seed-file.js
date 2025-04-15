'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    await queryInterface.bulkInsert('Trips', [
      {
        name: 'Tokyo trip',
        start_date: '2025-03-08',
        end_date: '2025-03-12',
        description: 'First time to Tokyo',
        created_at: new Date(),
        updated_at: new Date(),
        image: '/images/seed-photo/Japan-tokyo.jpg',
        user_id: users[0].id
      },
      {
        name: 'Birthday Journey : Osaka, Japan',
        start_date: '2025-04-13',
        end_date: '2025-04-18',
        description: 'It will definitely be fun',
        created_at: new Date(),
        updated_at: new Date(),
        image: '/images/seed-photo/Japan-osaka.jpg',
        user_id: users[0].id
      },
      {
        name: 'Go Thailand',
        start_date: '2025-05-10',
        end_date: '2025-05-17',
        description: "Girls' Trip, Finally going out together:)",
        created_at: new Date(),
        updated_at: new Date(),
        image: '/images/seed-photo/Thailand.jpg',
        user_id: users[0].id
      },
      {
        name: 'Family Trip : Korea',
        start_date: '2025-08-19',
        end_date: '2025-08-21',
        description: 'Going all out on Korean street food stalls!',
        created_at: new Date(),
        updated_at: new Date(),
        image: '/images/seed-photo/Korea.jpg',
        user_id: users[0].id
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Trips', {})
  }
}
