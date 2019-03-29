import { ORM, Op } from './orm/orm'
import GloApi from './GloApi'

class Ticker {
  constructor() {
    this.ticker = null
    this.tickInterval = 1000
    this.isTickPerforming = false
  }

  startTicker() {
    this.ticker = setInterval(this.tick, this.tickInterval)
  }

  stopInterval() {
    clearInterval(this.ticker)
  }

  async tick() {
    if (!this.isTickPerforming) {
      console.time('PointsEventTick')
      this.isTickPerforming = true

      const events = await ORM.Event.scope('eventType').findAll({ where: { state: 1 } })
      let dbUsers = {}
      let dbUsersAchievements = {}

      for (let event of events) {
        const userIdentified = `${event.userId}-${event.glowifyId}`
        console.log(`Processing event ${event.id}`)
        if (dbUsers[userIdentified] === undefined) {
          dbUsers[userIdentified] = await ORM.GlowifyUser.findOrCreate({
            where: { glowifyId: event.glowifyId, userId: event.userId },
          }).spread(user => user)
        }

        const achievementType = await ORM.AchievementEventType.findOne({
          where: { eventTypeId: event.eventTypeId },
          include: [ORM.Achievement],
        })

        const glowifyAchievement = await ORM.GlowifyAchievement.findOne({
          where: { glowifyId: event.glowifyId, achievementId: achievementType.achievement.id },
          include: [ORM.Achievement],
        })

        if (glowifyAchievement && dbUsersAchievements[event.userId] === undefined) {
          dbUsersAchievements[userIdentified] = await ORM.GlowifyUserAchievement.findOrCreate({
            where: {
              glowifyId: event.glowifyId,
              userId: event.userId,
              glowifyAchievementId: glowifyAchievement.id,
            },
          }).spread(user => user)
        }

        const dbGlowifyUser = dbUsers[userIdentified]
        const dbGlowifyUserAchievement = glowifyAchievement ? dbUsersAchievements[userIdentified] : null
        const points = dbGlowifyUser.dataValues.points + event.event_type.dataValues.points

        const ranking = await ORM.Ranking.findOne({
          where: { minPoints: { [Op.lte]: points } },
          order: [['position', 'DESC']],
        })
        const rankColumm = await ORM.GlowifyRankColumm.findOne({
          where: { glowifyId: event.glowifyId, rankingId: ranking.dataValues.id },
        })

        if (dbGlowifyUserAchievement) {
          await dbGlowifyUserAchievement.update({
            count: dbGlowifyUserAchievement.count + 1,
          })
        }

        await dbGlowifyUser.update({
          points,
          glowifyRankColumnId: rankColumm.dataValues.id,
        })

        await event.update({
          state: 2,
        })
      }

      console.log(`Post procession to Glo Api Card Column`)
      for (const id in dbUsers) {
        const dbGlowifyUser = await ORM.GlowifyUser.scope('full').findOne({
          where: { userId: dbUsers[id].userId, glowifyId: dbUsers[id].glowifyId },
        })

        const userEventCount = await ORM.Event.findAndCountAll({
          where: { userId: dbUsers[id].userId, glowifyId: dbUsers[id].glowifyId },
        })

        const achievementLabels = await ORM.GlowifyUserAchievement.findAll({
          where: { userId: dbUsers[id].userId, glowifyId: dbUsers[id].glowifyId },
          include: [{ model: ORM.GlowifyAchievement, include: [ORM.Achievement] }],
        }).filter(gua => {
          return gua.dataValues.count >= gua.glowify_achievement.achievement.dataValues.minEvents
        })

        const achievementLabelsDesc = achievementLabels
          .map(
            gua =>
              `${gua.glowify_achievement.achievement.dataValues.title}  ${
                gua.glowify_achievement.achievement.dataValues.description
              }`
          )
          .join(', ')

        const publishBoard = await dbGlowifyUser.glowify.getPublishBoard()
        const userCardData = {
          name: `${dbGlowifyUser.user.dataValues.name} ${dbGlowifyUser.dataValues.points}pts`,
          position: 0,
          description: {
            text: `## Profile of **${dbGlowifyUser.user.dataValues.name}**.
            \n### Points earned: ${dbGlowifyUser.dataValues.points}
            \n### Events created: ${userEventCount.count}
            \n### Achievements unlocked: ${achievementLabelsDesc}`,
          },
          labels: achievementLabels.map(gua => {
            return { id: gua.glowify_achievement.dataValues.gloId }
          }),
          column_id: dbGlowifyUser.glowify_rank_column.dataValues.gloId,
        }

        if (!dbGlowifyUser.gloCardId) {
          const gloCard = await GloApi(dbGlowifyUser.glowify.account.gloApiKey).cards.create(
            publishBoard.dataValues.gloId,
            userCardData
          )

          await dbGlowifyUser.update({
            gloCardId: gloCard.id,
          })
        } else {
          await GloApi(dbGlowifyUser.glowify.account.gloApiKey)
            .cards.edit(publishBoard.dataValues.gloId, dbGlowifyUser.gloCardId, userCardData)
            .catch(error => console.log(error))
        }
      }

      this.isTickPerforming = false
      console.timeEnd('PointsEventTick')
    }
  }
}

export default new Ticker()
