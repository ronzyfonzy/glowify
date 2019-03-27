import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })
import Sequelize from 'sequelize'
import bcrypt from 'bcrypt'
console.log(process.env.ENV)
const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: ['develop'].indexOf(process.env.ENV) !== -1 ? console.log : false,
})

const Account = sequelize.import(__dirname + '/models/account')
const Board = sequelize.import(__dirname + '/models/board')
const Glowify = sequelize.import(__dirname + '/models/glowify')
const User = sequelize.import(__dirname + '/models/user')
const EventType = sequelize.import(__dirname + '/models/eventType')
const Event = sequelize.import(__dirname + '/models/event')
const Ranking = sequelize.import(__dirname + '/models/ranking')
const RankColumm = sequelize.import(__dirname + '/models/glowifyRankColumn')
const GlowifyUser = sequelize.import(__dirname + '/models/glowifyUser')

Glowify.belongsTo(Account)
Glowify.belongsTo(Board, { foreignKey: 'listenBoardId', as: 'listenBoard' })
Glowify.belongsTo(Board, { foreignKey: 'publishBoardId', as: 'publishBoard' })
Glowify.hasMany(GlowifyUser, { as: 'glowifyUsers' })
Glowify.hasMany(RankColumm, { as: 'rankColumms' })
Glowify.addScope('boards', { include: [{ model: Board, as: 'listenBoard' }, { model: Board, as: 'publishBoard' }] })
Glowify.addScope('account', { include: [{ model: Account }] })
Glowify.addScope('glowifyUsers', { include: [{ model: GlowifyUser, as: 'glowifyUsers' }] })
Glowify.addScope('rankColumns', { include: [{ model: RankColumm, as: 'rankColumms' }] })

Event.belongsTo(Glowify)
Event.belongsTo(User)
Event.belongsTo(EventType)
Event.addScope('glowify', { include: [{ model: Glowify }] })
Event.addScope('user', { include: [{ model: User }] })
Event.addScope('eventType', { include: [{ model: EventType }] })
Event.addScope('full', { include: [{ model: Glowify, include: { model: Account } }, { model: EventType }] })

Ranking.hasMany(RankColumm, { as: 'rankColumms' })

RankColumm.belongsTo(Ranking)
RankColumm.belongsTo(Glowify)

GlowifyUser.belongsTo(Glowify)
GlowifyUser.belongsTo(User)
GlowifyUser.belongsTo(RankColumm)
GlowifyUser.addScope('full', { include: [{ model: Glowify, include: { model: Account } }, User, RankColumm] })

Account.prototype.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}
Account.prototype.toJSON = function() {
  var values = Object.assign({}, this.get())

  delete values.password
  return values
}

Glowify.prototype.toJSON = function() {
  var values = Object.assign({}, this.get())
  values.webhookUrl = `${process.env.SERVER_WEBHOOK_URL}/glo-event`
  return values
}

const postSync = async () => {
  await EventType.bulkCreate(require('./models/eventType').defaults())
  await Ranking.bulkCreate(require('./models/ranking').defaults())

  return true
}

const { Op } = Sequelize
const ORM = {
  Account,
  User,
  Board,
  Event,
  EventType,
  Glowify,
  Ranking,
  RankColumm,
  GlowifyUser,
}

export { sequelize, Op, ORM, postSync }
