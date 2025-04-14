const request = require('supertest')
const { expect } = require('chai')
const app = require('../app')
const { User } = require('../models')


describe('# 註冊測試: POST /signup', function () {
  const agent = request.agent(app)
  it('#01 不完整資訊應該返回 /signup', function (done) {
    agent
      .post('/signup')
      .send('name=test&email=test@example.com&shareId=&password=1234&confirmPassword=1234')
      .expect(302)
      .end((err, res) => {
        if (err) return done(err)

        agent
          .get('/signup')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)

            expect(res.text).to.include('Please complete all required fields')
            done()
          })
      })
  })

  it('#02 密碼不一致應該返回 /signup', function(done) {
    agent
      .post('/signup')
      .send('name=test&email=test@example.com&shareId=test&password=1234&confirmPassword=123')
      .expect(302)
      .end((err, res) => {
        if(err) return done(err)
        
        agent
          .get('/signup')
          .expect(200)
          .end((err, res) => {
            if(err) return done(err)

            expect(res.text).to.include('Passwords do not match!')
            done()
          })
      })
  })

  it('#03 註冊成功', function(done) {
    agent 
      .post('/signup')
      .send('name=test&email=test@example.com&shareId=test&password=1234&confirmPassword=1234')
      .expect(302)
      .end((err, res) => {
        if(err) return done(err)

        agent
          .get('/signin')
          .expect(200)
          .end((err, res) => {
            if(err) return done(err)

            expect(res.text).to.include('Sign-up successful!')
            done()
          })
      })
  })

  after('#04 刪除註冊成功之測試資料',async function(){
    await User.destroy({ where: { email: 'test@example.com' } })
  })
})

describe('# 登入測試: POST /signin', function () {
  it('#01 密碼錯誤應返回 /signin', function (done) {
    request(app)
      .post('/signin')
      .send('email=root@example.com&password=123')
      .expect('Location', '/signin')
      .expect(302, done)
  })

  it('#02 登入成功', function(done){
    request(app)
      .post('/signin')
      .send('email=root@example.com&password=1234')
      .expect('Location','/trips')
      .expect(302, done)
  })
})

