import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })
import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/server'

chai.use(chaiHttp).should()
let sessionCookie = null

describe('Auth Route', () => {
  let stopper = null

  before(async () => {
    sessionCookie = null
    if (stopper === null) {
      await app.start().then(s => (stopper = s))
    }
  })

  after(async done => {
    stopper.close()
    done()
  })

  it('Should be invalid route', done => {
    chai
      .request(app.server)
      .get('/loginer')
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
  })

  it('Should Signup', done => {
    chai
      .request(app.server)
      .post('/signup')
      .send({
        username: 'username',
        email: 'email',
        password: 'password',
      })
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })

  it('Should login', done => {
    chai
      .request(app.server)
      .post('/login')
      .send({
        username: 'username',
        password: 'password',
      })
      .end((err, res) => {
        res.should.have.status(200)
        res.header.should.have.property('set-cookie')
        sessionCookie = res.headers['set-cookie'].pop().split(';')[0]
        done()
      })
  })

  it('Should return unauthorized', done => {
    chai
      .request(app.server)
      .get('/glowify')
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
  })

  it('Should get empty Glowify', done => {
    chai
      .request(app.server)
      .get('/glowify')
      .set('cookie', sessionCookie)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('data')
        res.body.data.should.have.property('glowify')
        res.body.data.glowify.should.be.an('array').that.is.empty
        done()
      })
  })
})
