import { ORM, Op } from './orm/orm'
import GloApi from './GloApi'

class Ticker {
  constructor() {
    this.ticker = null
    this.tickInterval = 5000
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

      for (let event of events) {
        const userIdentified = `${event.userId}-${event.glowifyId}`
        console.log(`Processing event ${userIdentified}`)
        if (dbUsers[event.userId] === undefined) {
          dbUsers[userIdentified] = await ORM.GlowifyUser.findOrCreate({
            where: { glowifyId: event.glowifyId, userId: event.userId },
          }).spread(user => user)
        }

        const dbGlowifyUser = dbUsers[userIdentified]
        const points = dbGlowifyUser.dataValues.points + event.event_type.dataValues.points

        const ranking = await ORM.Ranking.findOne({
          where: { minPoints: { [Op.lte]: points } },
          order: [['position', 'DESC']],
        })
        const rankColumm = await ORM.RankColumm.findOne({
          where: { glowifyId: event.glowifyId, rankingId: ranking.dataValues.id },
        })

        await dbGlowifyUser.update({
          points,
          glowifyRankColumnId: rankColumm.dataValues.id,
        })

        await event.update({
          state: 2,
        })
      }

      console.log(`Post procession to Glo Api`)
      for (const id in dbUsers) {
        const dbGlowifyUser = await ORM.GlowifyUser.scope('full').findOne({
          where: { userId: dbUsers[id].userId, glowifyId: dbUsers[id].glowifyId },
        })

        const publishBoard = await dbGlowifyUser.glowify.getPublishBoard()
        const userCardData = {
          name: `${dbGlowifyUser.user.dataValues.name} ${dbGlowifyUser.dataValues.points}pts`,
          position: 0,
          description: {
            text: '',
          },
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
