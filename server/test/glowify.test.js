import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })
import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/server'

chai.use(chaiHttp).should()
let sessionCookie = null

const glowifyPayload = {
  listenBoard: {
    name: 'TestGround',
    id: '5c72c249bf41e4000f416507',
  },
  publishBoard: {
    name: 'TestGround Glowify',
    id: '5c7e08dfc85c0f000fdddffc',
  },
}
const eventPayload = {
  action: 'moved_column',
  board: {
    id: '5c72c249bf41e4000f416507',
    name: 'TestGround',
  },
  card: {
    id: '5c72c27139ba7f0011e381b3',
    name: 'Card-01',
    created_date: '2019-02-24T16:12:33.919Z',
    board_id: '5c72c249bf41e4000f416507',
    column_id: '5c72c267bf41e4000f416511',
    labels: [],
    assignees: [],
    completed_task_count: 0,
    total_task_count: 0,
    attachment_count: 0,
    comment_count: 0,
    description: {},
    created_by: {
      id: '82083f7c-4213-4a4f-8df4-9154cce4dd26',
    },
    position: 0,
  },
  sender: {
    name: 'Robert Tajnšek',
    id: '82083f7c-4213-4a4f-8df4-9154cce4dd26',
    username: 'ronzy',
  },
  sequence: 7,
}

describe('Glo Route', () => {
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
        sessionCookie = res.headers['set-cookie'].pop().split(';')[0]
        done()
      })
  })

  // it('Should create Glowify', done => {
  //   chai
  //     .request(app.server)
  //     .post('/glowify')
  //     .send(glowifyPayload)
  //     .set('cookie', sessionCookie)
  //     .end((err, res) => {
  //       res.should.have.status(200)
  //       res.body.should.have.property('data')
  //       res.body.data.should.be.an('object')
  //       done()
  //     })
  // })

  // it('Should Trigger Event', done => {
  //   chai
  //     .request(app.server)
  //     .post('/glo-event')
  //     .send(eventPayload)
  //     .set('user-agent', 'gk-webhooks')
  //     .set('x-gk-event', 'cards')
  //     .end((err, res) => {
  //       res.should.have.status(200)
  //       res.body.should.have.property('data')
  //       res.body.data.should.be.an('object')
  //       done()
  //     })
  // })
})
