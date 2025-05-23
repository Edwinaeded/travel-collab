'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const trips = await queryInterface.sequelize.query('SELECT id FROM Trips;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    await queryInterface.bulkInsert('Destinations', [
      {
        trip_id: trips[0].id,
        name: 'Meiji Jingu',
        description: 'Take a leisurely walk',
        date: '2025-03-08',
        start_time: '09:00',
        end_time: '11:00',
        cost: '¥0',
        address: '1-1 Yoyogikamizonocho, Shibuya, Tokyo 151-8557日本',
        image: '/images/seed-photo/meiji-temple.jpg',
        latitude: 35.67658062,
        longitude: 139.69927225,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        trip_id: trips[0].id,
        name: 'Tsukiji Outer Market',
        description: 'For lunch, lets have some sashimi, fresh oysters, scallops, and sea urchin',
        date: '2025-03-08',
        start_time: '12:00',
        end_time: '14:00',
        cost: '¥3000',
        address: '4 Chome Tsukiji, Chuo City, Tokyo 104-0045日本',
        image: '/images/seed-photo/sashimi.jpg',
        latitude: 35.66520120,
        longitude: 139.77078553,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        trip_id: trips[0].id,
        name: 'Akihabara',
        description: 'Anime merch, video games, and capsule toys!!',
        date: '2025-03-08',
        start_time: '15:00',
        end_time: '18:00',
        cost: '¥6000',
        address: '日本〒101-0021 Tokyo, Chiyoda City, Sotokanda, 3 Chome−15−5 MNビル 1F',
        image: '',
        latitude: 35.70197318,
        longitude: 139.77119341,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Destinations', null, {})
  }
}
