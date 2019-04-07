import express from 'express'
import crypto from 'crypto'
import GloApi from '../GloApi'
import { ORM, Op } from '../orm/orm'
const router = express.Router()

const createSignature = (buf, secret) => {
  const hmac = crypto.createHmac('sha1', secret)
  hmac.update(buf, 'utf-8')
  return 'sha1=' + hmac.digest('hex')
}

const verifyWebhookSignature = async (req, res, next) => {
  const { board } = req.body

  const dbBoard = await ORM.Board.findOne({
    where: { gloId: board.id },
  })

  const dbGlowify = await ORM.Glowify.findOne({
    where: { listenBoardId: dbBoard.dataValues.id },
    raw: true,
    attributes: ['id', 'secret', 'isActive'],
  })

  if (!dbGlowify.isActive) {
    return res.status(400).send({ error: 'Glowify is deactivated' })
  }

  req.dbBoard = dbBoard
  req.dbGlowify = dbGlowify

  if (process.env.ENV !== 'test') {
    const signature = createSignature(req.buf, dbGlowify.secret)
    if (signature !== req.headers['x-gk-signature']) {
      console.error({ error: 'invalid signature' })
      return res.status(403).send({ error: 'invalid signature' })
    }
  }

  next()
}

const veritySession = (req, res, next) => {
  if (!req.session.account) {
    return res.status(401).send({ error: 'not logged in' })
  }
  next()
}

const proccessRequest = async (dbGlowify, dbBoard, event, body) => {
  const { sender, action } = body

  let dbEventType = await ORM.EventType.findOne({
    where: {
      event: event,
      type: action,
    },
  })

  if (dbEventType === null) {
    throw new Error('Event Type not implemented')
  }

  const dbUser = await ORM.User.findOrCreate({
    where: { gloId: sender.id },
    defaults: {
      name: sender.name,
      username: sender.username,
    },
  }).spread(user => user.get())

  const dbEvent = await ORM.Event.create({
    glowifyId: dbGlowify.id,
    userId: dbUser.id,
    eventTypeId: dbEventType.dataValues.id,
    log: process.env.ENV === 'develop' ? JSON.stringify(body) : null,
  }).then(event => event.get())

  return dbEvent
}

const createGlowify = async (accountId, listenBoard, publishBoard) => {
  return await ORM.Glowify.create(
    {
      accountId: accountId,
      listenBoard: {
        name: listenBoard.name,
        gloId: listenBoard.id,
      },
      publishBoard: {
        name: publishBoard.name,
        gloId: publishBoard.id,
      },
    },
    {
      include: [{ model: ORM.Board, as: 'listenBoard' }, { model: ORM.Board, as: 'publishBoard' }],
    }
  )
}

const initializePublishBoard = async (gloApiKey, glowify) => {
  if (glowify.publishBoardState === 2) {
    const rankColumns = await ORM.GlowifyRankColumm.findAll({ where: { glowifyId: glowify.id }, raw: true })
    return {
      status: 'already_initialized',
      rankColumns,
    }
  }

  const publishBoard = await ORM.Board.findOne({ where: { id: glowify.publishBoardId }, raw: true })
  const rankings = await ORM.Ranking.findAll({ raw: true })
  const achievements = await ORM.Achievement.findAll()

  const board = await GloApi(gloApiKey).boards.get(publishBoard.gloId, { fields: ['columns', 'labels'] })
  const { columns, labels } = board
  const cards = await GloApi(gloApiKey).cards.getAll(publishBoard.gloId)

  // Clean publish board
  if (columns.length > 0 || cards.length > 0 || labels.length > 0) {
    console.log(`Cleaning up board ${board.title}${board.id}`)
    for (let card of cards) {
      console.log(`Deleting card ${card.id}`)
      await GloApi(gloApiKey).cards.delete(publishBoard.gloId, card.id)
    }

    for (let column of columns) {
      console.log(`Deleting column ${column.id}`)
      await GloApi(gloApiKey).columns.delete(publishBoard.gloId, column.id)
    }

    for (let label of labels) {
      console.log(`Deleting label ${label.id}`)
      await GloApi(gloApiKey).labels.delete(publishBoard.gloId, label.id)
    }
    console.log(`Board cleanup complete`)
  }

  // Init publish board
  let glowifyRankColumm = []
  for (let rank of rankings) {
    console.log(`Creating rank column ${rank.id}`)
    const createdColumn = await GloApi(gloApiKey).columns.create(publishBoard.gloId, rank.name, rank.position)
    glowifyRankColumm.push({
      glowifyId: glowify.id,
      rankingId: rank.id,
      gloId: createdColumn.id,
    })
  }
  await ORM.GlowifyRankColumm.bulkCreate(glowifyRankColumm)

  let glowifyAchievements = []
  for (let achievement of achievements) {
    const label = await GloApi(gloApiKey).labels.create(publishBoard.gloId, achievement.toJSONGlo())
    glowifyAchievements.push({
      gloId: label.id,
      glowifyId: glowify.id,
      achievementId: achievement.dataValues.id,
    })
  }
  await ORM.GlowifyAchievement.bulkCreate(glowifyAchievements)

  const rankColumns = await ORM.GlowifyRankColumm.findAll({ where: { glowifyId: glowify.id }, raw: true })

  return {
    status: 'initialized',
    rankColumns,
  }
}

router.post('/api/glo-event', verifyWebhookSignature, (req, res) => {
  proccessRequest(req.dbGlowify, req.dbBoard, req.headers['x-gk-event'], req.body)
    .then(event => {
      res.status(200).send({ data: event })
    })
    .catch(error => {
      console.error({ error })
      res.status(500).send({ error: error.message })
    })
})

router.get('/api/glo-boards', veritySession, (req, res) => {
  GloApi(req.session.account.gloApiKey)
    .boards.getAll({ archived: false })
    .then(data => {
      res.status(200).send({ data })
    })
    .catch(error => {
      console.error({ error: error })
      if (error.response.status === 401) {
        res.status(503).send({ error: error.message })
      } else {
        res.status(error.response.status).send({ error: error.message })
      }
    })
})

router.get('/api/event-types', veritySession, async (req, res) => {
  const eventTypes = await ORM.EventType.findAll()
  res.send({ data: { eventTypes } })
})

router.get('/api/achievements', veritySession, async (req, res) => {
  const achievements = await ORM.Achievement.findAll({
    include: [{ model: ORM.AchievementEventType, include: [{ model: ORM.EventType }] }],
  })
  res.send({ data: { achievements } })
})

router.get('/api/ranks', veritySession, async (req, res) => {
  const ranks = await ORM.Ranking.findAll()
  res.send({ data: { ranks } })
})

router.get('/api/glowify', veritySession, async (req, res) => {
  const glowify = await ORM.Glowify.scope('boards').findAll({ where: { accountId: req.session.account.id } })
  for (let g of glowify) {
    g.dataValues.eventCounter = await ORM.Event.findAndCountAll({ where: { glowifyId: g.dataValues.id } })
  }
  res.send({ data: { glowify } })
})

router.post('/api/glowify', veritySession, async (req, res) => {
  let { listenBoard, publishBoard } = req.body

  if (publishBoard === null) {
    // ToDo: create board if not defined in request
  }

  if (!listenBoard || !publishBoard) {
    res.status(400).send({ error: `You have to specify listen and publish board` })
  }

  const boards = await ORM.Board.findAll({
    where: {
      [Op.or]: [{ gloId: listenBoard.id }, { gloId: publishBoard.id }],
    },
  })

  if (boards.length !== 0) {
    res.status(400).send({ error: `The boards ${boards.map(a => `'${a.name}'`).join(', ')} are already in Glowify` })
  } else {
    const glowify = await createGlowify(req.session.account.id, listenBoard, publishBoard)
    const initResult = await initializePublishBoard(req.session.account.gloApiKey, glowify)

    res.status(200).send({ data: { glowify, rankColumns: initResult.rankColumns, status: initResult.status } })
  }
})

router.put('/api/glowify', veritySession, async (req, res) => {
  await ORM.Glowify.update(
    {
      isActive: req.body.isActive,
    },
    { where: { id: req.body.id } }
  )
  const glowify = await ORM.Glowify.findOne({ where: { id: req.body.id } })
  res.send({ data: { glowify } })
})

export default router
