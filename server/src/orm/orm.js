import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })
import Sequelize from 'sequelize'
import bcrypt from 'bcrypt'
import GloApi from '../GloApi'

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
  values.webhookUrl = `${process.env.SERVER_WEBHOOK_URL}/glo-event`
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

  if (process.env.ENV === 'develop') {
    await Account.create({
      username: 'username',
      email: 'test@test.com',
      password: 'password',
      gloApiKey: 'pe8d4c60913055ce02f4db856a324e24d27e7dcb4',
    }).then(async account => {
      const glowify = await Glowify.create(
        {
          accountId: account.id,
          publishBoardState: 2,
          secret: '1e7d57096d2a9d99147e0c0713ea34b6b4c52d197a3d75d3cd0255cbadc3954f',
          listenBoard: {
            name: 'LocalBoard',
            gloId: '5c9cabfe96ab06000fb075e6',
          },
          publishBoard: {
            name: 'TLocatBoard Glowify',
            gloId: '5c9cac038c7a3a0011c8e14e',
          },
        },
        {
          include: [{ model: Board, as: 'listenBoard' }, { model: Board, as: 'publishBoard' }],
        }
      )

      const user = await User.create({
        gloId: '82083f7c-4213-4a4f-8df4-9154cce4dd26',
        name: 'Robert Tajnšek',
        username: 'ronzy',
      })

      await GlowifyRankColumm.bulkCreate([
        {
          glowifyId: glowify.id,
          rankingId: 1,
          gloId: '5c9cac2496ab06000fb075ea',
        },
        {
          glowifyId: glowify.id,
          rankingId: 2,
          gloId: '5c9cac2496ab06000fb075eb',
        },
        {
          glowifyId: glowify.id,
          rankingId: 3,
          gloId: '5c9cac2596ab06000fb075ec',
        },
        {
          glowifyId: glowify.id,
          rankingId: 4,
          gloId: '5c9cac2596ab06000fb075ed',
        },
      ])

      await GlowifyAchievement.bulkCreate([
        { id: 1, gloId: '5c9cc9f6c6c3bd001268a513', achievementId: 1, glowifyId: 1 },
        { id: 2, gloId: '5c9cc9f7c6c3bd001268a514', achievementId: 2, glowifyId: 1 },
        { id: 3, gloId: '5c9cc9f796ab06000fb079b0', achievementId: 3, glowifyId: 1 },
        { id: 4, gloId: '5c9cc9f8c6c3bd001268a516', achievementId: 4, glowifyId: 1 },
      ])

      await GlowifyUser.create({
        gloCardId: '5c9cac4bc6c3bd001268a15e',
        points: 0,
        glowifyId: glowify.id,
        userId: user.id,
        glowifyRankColumnId: 1,
      })

      await Event.bulkCreate([
        {
          glowifyId: glowify.id,
          userId: user.id,
          state: 1,
          eventTypeId: 20,
        },
        {
          glowifyId: glowify.id,
          userId: user.id,
          state: 1,
          eventTypeId: 20,
        },
        {
          glowifyId: glowify.id,
          userId: user.id,
          state: 1,
          eventTypeId: 20,
        },
        {
          glowifyId: glowify.id,
          userId: user.id,
          state: 1,
          eventTypeId: 20,
        },
      ])

      // const achievements = await Achievement.findAll()
      // console.log(achievements)
      // let glowifyAchievements = []
      // for (const a of achievements) {
      //   const label = await GloApi('pe8d4c60913055ce02f4db856a324e24d27e7dcb4')
      //     .labels.create('5c9cac038c7a3a0011c8e14e', a.toJSON())
      //     .catch(error => console.log(error.response.data))
      //   glowifyAchievements.push({
      //     gloId: label.id,
      //     glowifyId: glowify.id,
      //     achievementId: a.dataValues.id,
      //   })
      // }
      // await GlowifyAchievement.bulkCreate(glowifyAchievements)
    })
  }
  // const event = await ORM.Event.scope('ticker').findAll({ where: { state: 1 } })
  // console.log(event[0].user)
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
