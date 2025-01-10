'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Trips', [
      {
        name: '日本東京之旅',
        start_date: '2025-03-08',
        end_date: '2025-03-12',
        description: '第一次去日本東京，每個景點都來一點~~',
        created_at: new Date(),
        updated_at: new Date(),
        image: '/images/seed-photo/Japan-tokyo.jpg'
      },
      {
        name: '日本大阪生日之旅',
        start_date: '2025-04-13',
        end_date: '2025-04-18',
        description: '去大阪過生日!!這趟旅程一定很好玩:)',
        created_at: new Date(),
        updated_at: new Date(),
        image: '/images/seed-photo/Japan-osaka.jpg'
      },
      {
        name: '泰國閨蜜之旅',
        start_date: '2025-05-10',
        end_date: '2025-05-17',
        description: '終於一起出去玩,我們飛泰遠 泰好玩!',
        created_at: new Date(),
        updated_at: new Date(),
        image: '/images/seed-photo/Thailand.jpg'
      },
      {
        name: '韓國Family Trip',
        start_date: '2025-08-19',
        end_date: '2025-08-21',
        description: '說好不吵架,尊重友善包容,絕對要吃爆韓國路邊攤',
        created_at: new Date(),
        updated_at: new Date(),
        image: '/images/seed-photo/Korea.jpg'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Trips', {})
  }
}
