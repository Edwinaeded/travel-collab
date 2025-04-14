const request = require('supertest')
const { expect } = require('chai')
const app = require('../app')
const { Trip } = require('../models')

describe('# Create Trip Test: POST /trips', function() {
  const agent = request.agent(app)

  before(async function() {
    await agent
      .post('/signin')
      .send('email=root@example.com&password=1234')
      .expect(302)
      .expect('Location', '/trips')
  })

  it('#01 Trip必填資料不完整應報錯', async function() {
    const postTripRes = await agent
      .post('/trips')
      .send('name=testPostTrip&startDate=&endDate=&description=testDescription')
      .expect(302)
      .expect('Location', '/trips')
    
    const followUp = await agent.get('/trips/create')
    expect(followUp.text).to.include('Please complete all required fields')
  })

  it('#02 Trip新增成功', async function() {
    const postTripRes = await agent
      .post('/trips')
      .send('name=testPostTrip&startDate=2025-04-11&endDate=2025-04-12&description=testDescription')
      .expect(302)
      .expect('Location', '/trips')

    const followUp = await agent.get('/trips')
    expect(followUp.text).to.include('[ testPostTrip ] has been created successfully!')
  })

  after(async function() {
    await Trip.destroy({ where: { name: 'testPostTrip' }, force: true })
  })
})

describe('# Get Trip Test: GET /trips', function() {
  const agent = request.agent(app)

  it('#01 未登入者應被返回 /signin', async function() {
    const getTripsRes = await agent
      .get('/trips')
      .expect(302)
      .expect('Location', '/signin')
  })

  it('#02 登入者成功渲染 /trips', async function() {
    await agent
      .post('/signin')
      .send('email=root@example.com&password=1234')
      .expect(302)
      .expect('Location', '/trips')

    const getTripsRes = await agent
      .get('/trips')
      .expect(200)
    expect(getTripsRes.text).to.include('My Trips')
    expect(getTripsRes.text).to.include('Shared Trips')
  })
})

describe('# Edit Trip Test: PUT /trips/:id', function() {
  const agent = request.agent(app)
  let tripId
  let updatedAt

  before(async function() {
    await agent
      .post('/signin')
      .send('email=root@example.com&password=1234')
      .expect(302)
      .expect('Location', '/trips')

    await agent
      .post('/trips')
      .send('name=testPutTrip&startDate=2025-04-11&endDate=2025-04-12&description=testDescription')
      .expect(302)
      .expect('Location', '/trips')

    const trip = await Trip.findOne({ 
      where: { name: 'testPutTrip' },
      order: [['createdAt', 'DESC']]
    })
    tripId = trip.id
    tripUpdatedAt = trip.updatedAt.toISOString()
  })

  it('#01 Trip資料不完整應報錯', async function() {
    const putTripRes = await agent
      .put(`/trips/${tripId}`)
      .send(`name=testPutTrip_edited&startDate=&endDate=&description=testDescription&updatedAt=${tripUpdatedAt}`)
      .expect(302)

    const followUp = await agent.get(`/trips/${tripId}/edit`)
    expect(followUp.text).to.include('Please complete all required fields')
  }) 

  it('#02 Trip編輯成功', async function() {
    const putTripRes = await agent
      .put(`/trips/${tripId}`)
      .send(`name=testPutTrip_edited&startDate=2025-04-11&endDate=2025-04-12&description=testDescription&updatedAt=${tripUpdatedAt}`)
      .expect(302)
      .expect('Location', '/trips')

    const followUp = await agent.get(`/trips/${tripId}`)
    expect(followUp.text).to.include('testPutTrip_edited')
  })

  after(async function() {
    await Trip.destroy({ where: { id: tripId }, force: true })
  })
})

describe('# Delete Trip Test: DELETE /trips/:id', function() {
  const agent = request.agent(app)
  let tripId

  before(async function() {
    await agent
      .post('/signin')
      .send('email=root@example.com&password=1234')
      .expect(302)
      .expect('Location', '/trips')

    await agent
      .post('/trips')
      .send('name=testDeleteTrip&startDate=2025-04-11&endDate=2025-04-12&description=testDescription')
      .expect(302)
      .expect('Location', '/trips')

    const trip = await Trip.findOne({
      where: { name: 'testDeleteTrip' },
      order: [['createdAt', 'DESC']]
    })
    tripId = trip.id
  })

  it('#01 Trip刪除成功', async function() {
    const deleteTripRes = await agent
      .delete(`/trips/${tripId}`)
      .expect(302)
      .expect('Location', '/trips')

    const followUp = await agent.get('/trips')
    expect(followUp.text).to.include('Trip has been deleted successfully!')
  })
})
