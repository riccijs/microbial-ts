import * as customENV from 'custom-env'
import * as glob from 'glob'
import { Conf } from './conf.x'

/************************************************
 * Get .env for the current environment
 ************************************************/
customENV.env(process.env.NODE_ENV)

/************************************************
 * Load constants from the process.env
 ************************************************/
const {
  APP_TITLE = '',
  APP_DESCRIPTION = '',
  APP_HOST = '',
  APP_PORT = '',
  APP_PROTOCOL = '',
  APP_VERSION = '',
  DATABASE_URI = '',
  DATABASE_USER = '',
  DATABASE_PWD = '',
  DATABASE_NEW_URL_PARSER = '',
  DATABASE_CREATE_INDEX = '',
  SESSION_COOKIE_EXPIRATION = '',
  SESSION_COOKIE_HTTP_ONLY = '',
  SESSION_COOKIE_SECURE = '',
  SESSION_SECRET = '',
  SESSION_KEY = '',
  SESSION_COLLECTION = '',
  CSRF_CSRF = '',
  CSRF_CSP = '',
  CSRF_XFRAME = '',
  CSRF_P3P = '',
  CSRF_XSS_PROTECTION = '',
  LOG_FORMAT = '',
  LOG_FILE_NAME = '',
  LOG_MAX_SIZE = '',
  LOG_MAX_FILES = '',
  LOG_JSON_OUTPUT = '',
  SECURE_SSL = '',
  SECURE_PRIVATE_KEY = '',
  SECURE_CERTIFICATE = '',
  LIVE_RELOAD = '',
  ASSETS_MODELS = '',
  ASSETS_ROUTES = '',
  ASSETS_SOCKETS = '',
  ASSETS_EXPRESS = '',
  ASSETS_POLICIES = ''
} = process.env

/************************************************
 * Application confuration
 ************************************************/
const conf: Conf = {
  
  // Application 
  app: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    port: APP_PORT,
    host: APP_HOST,
    protocol: APP_PROTOCOL,
    version: APP_VERSION
  },

  // Database 
  db: {
    uri: DATABASE_URI,
    options: {
      user: DATABASE_USER,
      pass: DATABASE_PWD,
      useNewUrlParser: DATABASE_NEW_URL_PARSER === 'true',
      useCreateIndex: DATABASE_CREATE_INDEX === 'true'
    }
  },

  // Session 
  sessionCookie: {
    maxAge: Number(SESSION_COOKIE_EXPIRATION),
    httpOnly: SESSION_COOKIE_HTTP_ONLY === 'true',
    secure: SESSION_COOKIE_SECURE === 'true'
  },
  sessionSecret: SESSION_SECRET,
  sessionKey: SESSION_KEY,
  sessionCollection: SESSION_COLLECTION,

  // CSRF 
  csrf: {
    csrf: CSRF_CSRF === 'true',
    csp: CSRF_CSP === 'true',
    xframe: CSRF_XFRAME,
    p3p: CSRF_P3P,
    xssProtection: CSRF_XSS_PROTECTION === 'true'
  },

  // Logging
  log: {
    format: LOG_FORMAT,
    fileLogger: {
      fileName: LOG_FILE_NAME,
      maxsize: Number(LOG_MAX_SIZE),
      maxFiles: Number(LOG_MAX_FILES),
      json: LOG_JSON_OUTPUT === 'true'
    }
  },

  // SSL
  secure: {
    ssl: SECURE_SSL === 'true',
    privateKey: SECURE_PRIVATE_KEY,
    certificate: SECURE_CERTIFICATE
  },

  // Live reload
  livereload: LIVE_RELOAD === 'true',

  // Assets
  assets: {
    models: glob.sync(ASSETS_MODELS || ''),
    routes: glob.sync(ASSETS_ROUTES || ''),
    sockets: glob.sync(ASSETS_SOCKETS || ''),
    express: glob.sync(ASSETS_EXPRESS || ''),
    policies: glob.sync(ASSETS_POLICIES || '')
  }
}

export default conf
