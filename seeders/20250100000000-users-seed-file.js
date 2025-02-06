'use strict'
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'root',
        email: 'root@example.com',
        password: await bcrypt.hash('1234', 10),
        is_admin: true,
        image: '/images/seed-photo/user-root.svg',
        created_at: new Date(),
        updated_at: new Date(),
        share_id: 'root0000'
      },
      {
        name: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('1111', 10),
        is_admin: false,
        image: '/images/seed-photo/user1.svg',
        created_at: new Date(),
        updated_at: new Date(),
        share_id: 'user1'
      },
      {
        name: 'user2',
        email: 'user2@example.com',
        password: await bcrypt.hash('2222', 10),
        is_admin: false,
        image: '/images/seed-photo/user2.svg',
        created_at: new Date(),
        updated_at: new Date(),
        share_id: 'user2'
      },
      {
        name: 'user3',
        email: 'user3@example.com',
        password: await bcrypt.hash('3333', 10),
        is_admin: false,
        image: '/images/seed-photo/user3.svg',
        created_at: new Date(),
        updated_at: new Date(),
        share_id: 'user3'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
