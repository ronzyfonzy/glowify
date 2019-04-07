import express from 'express'
import { ORM } from '../orm/orm'

const router = express.Router()

router.post('/api/signup', (req, res) => {
  ORM.Account.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })
    .then(account => {
      req.session.account = account.dataValues
      return res.status(200).send({ account })
    })
    .catch(error => {
      console.log(error)
      return res.status(400).send({ error: error.message })
    })
})

router.post('/api/login', (req, res) => {
  let { username, password } = req.body

  ORM.Account.findOne({ where: { username } }).then(account => {
    if (!account) {
      return res.status(403).send({ error: 'invalid username' })
    } else if (!account.validPassword(password)) {
      return res.status(403).send({ error: 'Invalid password' })
    } else {
      req.session.account = account.dataValues
      return res.status(200).send({
        id: account.dataValues.id,
        name: account.dataValues.name,
        username: account.dataValues.username,
        email: account.dataValues.email,
      })
    }
  })
})

router.get('/api/user-preferences', async (req, res) => {
  if (req.session.account && req.cookies[process.env.SERVER_SESSION_KEY]) {
    const account = await ORM.Account.findOne({ where: { id: req.session.account.id } })
    if (account) {
      return res.status(200).send({ gloApiKey: account.gloApiKey })
    } else {
      return res.status(400).send({})
    }
  } else {
    return res.status(401).send({})
  }
})

router.put('/api/user-preferences', async (req, res) => {
  if (req.session.account && req.cookies[process.env.SERVER_SESSION_KEY]) {
    const account = await ORM.Account.findOne({ where: { id: req.session.account.id } })
    await account.update({ gloApiKey: req.body.gloApiKey })
    if (account) {
      req.session.account.gloApiKey = account.gloApiKey
      return res.status(200).send({ gloApiKey: account.gloApiKey })
    } else {
      return res.status(400).send({})
    }
  } else {
    return res.status(400).send({})
  }
})

router.get('/api/logout', (req, res) => {
  if (req.session.account && req.cookies[process.env.SERVER_SESSION_KEY]) {
    res.clearCookie(process.env.SERVER_SESSION_KEY)
    return res.status(200).send({})
  } else {
    return res.status(400).send({})
  }
})

export default router
