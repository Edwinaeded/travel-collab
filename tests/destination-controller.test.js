const request = require('supertest')
const { expect } = require('chai')
const app = require('../app')
const { Destination } = require('../models')

describe('# Get Destination Test: GET /destinations/:id', function() {
  let destinationId

  before(async function() {
    const destinationTestData = await Destination.findAll({
      order: [['id', 'ASC']],
      limit: 1
    })
    destinationId = destinationTestData[0].id
  })

  it('#01 未登入者應被返回 /signin', async function() {
    const agent = request.agent(app)
    const getDestinationRes = await agent
      .get(`/destinations/${destinationId}`)
      .expect(302)
      .expect('Location', '/signin')
  })

  it('#02 登入者成功渲染 /destinations/:id', async function() {
    const agent = request.agent(app)
    await agent
    .post('/signin')
    .send('email=root@example.com&password=1234')
    .expect(302)
    
    const getDestinationRes = await agent
      .get(`/destinations/${destinationId}`)
      .expect(200)
    expect(getDestinationRes.text).to.include('Meiji Jingu')
  })
})
