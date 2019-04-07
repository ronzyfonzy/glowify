import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })
import Sequelize from 'sequelize'
import bcrypt from 'bcrypt'

const { DB_DRIVER, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT } = process.env

let sequelizeConfig = {
  dialect: DB_DRIVER,
  database: DB_NAME,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST || '127.0.0.1',
  port: DB_PORT || 3306,
  logging: ['develop'].indexOf(process.env.ENV) !== -1 ? console.log : false,
}

if (sequelizeConfig.dialect === 'sqlite') {
  sequelizeConfig.storage = './database.sqlite'
}

const sequelize = new Sequelize(sequelizeConfig)

const Account = sequelize.import(__dirname + '/models/account')
const Board = sequelize.import(__dirname + '/models/board')
const Glowify = sequelize.import(__dirname + '/models/glowify')
const User = sequelize.import(__dirname + '/models/user')
const EventType = sequelize.import(__dirname + '/models/eventType')
const Event = sequelize.import(__dirname + '/models/event')
const Ranking = sequelize.import(__dirname + '/models/ranking')
const Achievement = sequelize.import(__dirname + '/models/achievement')
const AchievementEventType = sequelize.import(__dirname + '/models/achievementEventType')
const GlowifyUser = sequelize.import(__dirname + '/models/glowifyUser')
const GlowifyRankColumm = sequelize.import(__dirname + '/models/glowifyRankColumn')
const GlowifyAchievement = sequelize.import(__dirname + '/models/glowifyAchievement')
const GlowifyUserAchievement = sequelize.import(__dirname + '/models/glowifyUserAchievement')

Event.belongsTo(Glowify)
Event.belongsTo(User)
Event.belongsTo(EventType)
Event.addScope('glowify', { include: [{ model: Glowify }] })
Event.addScope('user', { include: [{ model: User }] })
Event.addScope('eventType', { include: [{ model: EventType }] })
Event.addScope('full', { include: [{ model: Glowify, include: { model: Account } }, { model: EventType }] })

Ranking.hasMany(GlowifyRankColumm, { as: 'rankColumms' })

Achievement.hasMany(AchievementEventType)

AchievementEventType.belongsTo(Achievement)
AchievementEventType.belongsTo(EventType)

Glowify.belongsTo(Account)
Glowify.belongsTo(Board, { foreignKey: 'listenBoardId', as: 'listenBoard' })
Glowify.belongsTo(Board, { foreignKey: 'publishBoardId', as: 'publishBoard' })
Glowify.hasMany(GlowifyUser, { as: 'glowifyUsers' })
Glowify.hasMany(GlowifyRankColumm, { as: 'rankColumms' })
Glowify.addScope('boards', { include: [{ model: Board, as: 'listenBoard' }, { model: Board, as: 'publishBoard' }] })
Glowify.addScope('account', { include: [{ model: Account }] })
Glowify.addScope('glowifyUsers', { include: [{ model: GlowifyUser, as: 'glowifyUsers' }] })
Glowify.addScope('rankColumns', { include: [{ model: GlowifyRankColumm, as: 'rankColumms' }] })

GlowifyRankColumm.belongsTo(Ranking)
GlowifyRankColumm.belongsTo(Glowify)

GlowifyAchievement.belongsTo(Achievement)
GlowifyAchievement.belongsTo(Glowify)

GlowifyUser.belongsTo(Glowify)
GlowifyUser.belongsTo(User)
GlowifyUser.belongsTo(GlowifyRankColumm)
GlowifyUser.addScope('full', { include: [{ model: Glowify, include: { model: Account } }, User, GlowifyRankColumm] })

GlowifyUserAchievement.belongsTo(Glowify)
GlowifyUserAchievement.belongsTo(User)
GlowifyUserAchievement.belongsTo(GlowifyAchievement)
// GlowifyUserAchievement.addScope('full', { include: [Glowify, Achievement, GlowifyAchievement] })

Account.prototype.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}
Account.prototype.toJSON = function() {
  let values = Object.assign({}, this.get())

  delete values.password
  return values
}

Glowify.prototype.toJSON = function() {
  let values = Object.assign({}, this.get())
  values.webhookUrl = `${process.env.SERVER_WEBHOOK_URL}/api/glo-event`
  return values
}

Achievement.prototype.toJSONGlo = function() {
  let values = Object.assign({}, this.get())
  const rgba = values.color.split(',')
  return {
    name: values.title,
    color: {
      r: +rgba[0],
      g: +rgba[1],
      b: +rgba[2],
      a: +rgba[3],
    },
  }
}

const postSync = async () => {
  const isSeeded = await EventType.findAndCountAll()
  if (isSeeded.count === 0) {
    await EventType.bulkCreate(require('./models/eventType').defaults())
    await Ranking.bulkCreate(require('./models/ranking').defaults())
    await Achievement.bulkCreate(require('./models/achievement').defaults())
    await AchievementEventType.bulkCreate(require('./models/achievementEventType').defaults())
  }

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
  GlowifyRankColumm,
  GlowifyUser,
  Achievement,
  AchievementEventType,
  GlowifyUserAchievement,
  GlowifyAchievement,
}

export { sequelize, Op, ORM, postSync }
