import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })
import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import cors from 'cors'
import { sequelize, postSync } from './orm/orm'
import auth from './routes/auth'
import glo from './routes/glo'
import ticker from './ticker'

if (!process.env.ENV) {
  console.error('No environment variable defined')
  process.exit()
}

const server = express()
  .use(cookieParser())
  .use(cors({ credentials: true, origin: true }))
  .use(
    bodyParser.json({
      verify: (req, res, buf) => {
        req.buf = buf
      },
    })
  )
  .use(
    session({
      key: process.env.SERVER_SESSION_KEY,
      secret: process.env.SERVER_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: 600000,
      },
    })
  )
  .use((req, res, next) => {
    if (req.cookies[process.env.SERVER_SESSION_KEY] && !req.session.account) {
      res.clearCookie(process.env.SERVER_SESSION_KEY)
    }
    next()
  })
  .use(express.static(path.join(__dirname, '../../client/build')))
  .use(
    ['/home', '/signup', '/login', '/user', '/glowifys', '/glowify-add'],
    express.static(path.join(__dirname, '../../client/build'))
  )
  .use(auth)
  .use(glo)
  .use((req, res, next) => {
    res.status(404).send('¯\\_(ツ)_/¯')
  })

const app = {
  server: server,
  start: async function() {
    return sequelize
      .authenticate()
      .then(() => {
        if (process.env.ENV !== 'production') {
          return sequelize.sync({ force: true })
        } else {
          return sequelize.sync()
        }
      })
      .then(() => postSync())
      .then(() => {
        return server.listen(process.env.SERVER_PORT, () => {
          console.log(`App started on port ${process.env.SERVER_PORT}`)
          ticker.startTicker()
        })
      })
      .catch(error => {
        console.error({ error })
      })
  },
}

if (process.env.ENV !== 'test') {
  app.start().then(s => {
    // s.close()
  })
}

export default app
