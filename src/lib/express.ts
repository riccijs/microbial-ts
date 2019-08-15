import conf from '../conf'
import express from 'express'
import morgan from 'morgan'
import logger from './logger'
import bodyParser from 'body-parser'
import session from 'express-session'
import compress from 'compression'
import methodOverride from 'method-override'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import flash from 'connect-flash'
import path from 'path'
import _ from 'lodash'
import socketio from './socket.io'
import lusca from 'lusca'
import fs from 'fs'
import chalk from 'chalk'

const MongoStore = require('connect-mongo')(session)
const isProduction = process.env.NODE_ENV === 'production'

/*********************************************
 * Validate certs exit (if secure.ssl)
**********************************************/
function initSSLValidation() {
  if (!conf.secure.ssl) return true

  const privateKey = fs.existsSync(path.resolve(conf.secure.privateKey))
  const certificate = fs.existsSync(path.resolve(conf.secure.certificate))

  if (!privateKey || !certificate) {
    console.log(chalk.red('+ Error: Certificate file or key file is missing, falling back to non-SSL mode'))
    console.log(chalk.red('  To create them, simply run the following from your shell: sh ./scripts/generate-ssl-certs.sh'))
    console.log()
    conf.secure.ssl = false
  }
}

/*********************************************
 * Configure the modules ACL policies
**********************************************/
function initModulesServerPolicies() {
  conf.assets.policies.forEach(policyPath => {
    require(path.join(process.cwd(), policyPath)).invokeRolesPolicies()
  })
}

/*********************************************
 * Initialize the session
 *********************************************/
function initSession(app, db) {
  const sessionConfig = session({
    saveUninitialized: true,
    resave: true,
    secret: conf.sessionSecret,
    cookie: {
      maxAge: conf.sessionCookie.maxAge,
      httpOnly: conf.sessionCookie.httpOnly,
      secure: conf.sessionCookie.secure
    },
    name: conf.sessionKey,
    store: new MongoStore({
      mongooseConnection: db.connection,
      collection: conf.sessionCollection
    })
  })
  app.use(sessionConfig)
  app.use(lusca(conf.csrf))

  return sessionConfig
}

/*********************************************
 * Initialize local variables
 *********************************************/
function initLocalVariables(app) {
  const { title, description } = conf.app
  const { secure, livereload } = conf

  // Setting application local variables
  app.locals = {
    title,
    description,
    secure: secure && secure.ssl,
    livereload,
    env: process.env.NODE_ENV
  }

  // Passing the request url to environment locals
  app.use((req, res, next) => {
    res.locals.host = `${req.protocol}://${req.hostname}`
    res.locals.url = `${req.protoco}://${req.headers.host}${req.originalUrl}`
    next()
  })

  //CORS middleware
  const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.APP_HOST)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
  }  
  app.use(allowCrossDomain)
}

/*********************************************
 * Initialize application middleware
 *********************************************/
function initMiddleware(app) {
  // Should be placed before express.static
  app.use(compress({
    filter: (req, res) => {
      return (/json|text|javascript|typescript|css|font|svg/).test(res.getHeader('Content-Type'))
    },
    level: 9
  }))

  // Enable logger (morgan) if enabled in the configuration file
  if (logger.getLogFormat && logger.getMorganOptions) {
    app.use(morgan(logger.getLogFormat(), logger.getMorganOptions()))
  }

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Disable views cache
    app.set('view cache', false)
  } else if (isProduction) {
    app.locals.cache = 'memory'
  }

  // Request body parsing middleware should be above methodOverride
  app.engine('html', require('ejs').renderFile)
  app.set('view engine', 'html')


  // Add this code for maximun 150mb
  app.use(bodyParser.json({limit: '150mb'}))
  app.use(bodyParser.urlencoded({
    limit: '150mb',
    extended: true
  }))

  app.use(methodOverride())

  // Add the cookie parser and flash middleware
  app.use(cookieParser(conf.sessionSecret))
  app.use(flash())  
}

/*********************************************
 * Invoke modules server configuration
 *********************************************/
const initModulesConfiguration = app => {
  conf.assets.routes.forEach(routePath => {
    require(path.join(process.cwd(), routePath))(app)
  })
  conf.assets.express.forEach(expressPath => {
    require(path.join(process.cwd(), expressPath))(app)
  })
}

/*********************************************
 * Configure Helmet headers configuration
 *********************************************/
function initHelmetHeaders(app) {
  // Use helmet to secure Express headers
  const SIX_MONTHS = 15778476000
  app.use(helmet.frameguard())
  app.use(helmet.xssFilter())
  app.use(helmet.noSniff())
  app.use(helmet.ieNoOpen())
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubDomains: true,
    force: true
  }))
  app.disable('x-powered-by')
}

/*********************************************
 * Initialize the Express application
 *********************************************/
export default (db) => {
  const app = express()
  const sessionConfig = initSession(app, db)
  
  initSSLValidation()
  initModulesServerPolicies()
  initLocalVariables(app)
  initMiddleware(app)
  initHelmetHeaders(app)
  initModulesConfiguration(app)

  return socketio(app, sessionConfig)
}