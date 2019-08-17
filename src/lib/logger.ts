import conf from '../conf/conf'
import chalk from 'chalk'
import fs from 'fs'
import winston from 'winston'
import { Logger } from './logger.x'

/************************************************
 * Logger formats
 ************************************************/
const LOGGER_FORMATS = ['combined', 'common', 'dev', 'short', 'tiny']

/************************************************
 * Logger
 ************************************************/
const logger: Logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      colorize: true,
      showLevel: true,
      handleExceptions: true,
      humanReadableUnhandledException: true
    })
  ],
  exitOnError: false
})

/************************************************
 * Logger stream
 ************************************************/
logger.stream = {
  write: function(msg) {
    logger.info(msg)
  }
}

/**************************************************************
 * Instantiate a winston's File transport for disk file logging
 * @param logger a valid winston logger object
 **************************************************************/
logger.setupFileLogger = function setupFileLogger() {
  const fileLoggerTransport = this.getLogOptions ? this.getLogOptions() : false
  if (!fileLoggerTransport) {
    return false
  }

  try {
    if (fs.openSync(fileLoggerTransport.filename, 'a+')) {
      logger.add(winston.transports.File, fileLoggerTransport)
    }
    return true
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.log()
      console.log(chalk.red('An error has occured during the creation of the File transport logger.'))
      console.log(chalk.red(err))
      console.log()
    }
    return false
  }
}

/**************************************************************
 * Returns a Winston object for logging with the File transport
 **************************************************************/
logger.getLogOptions = function getLogOptions() {
  const _config: any = new Object(conf)
  const configFileLogger = _config.log.fileLogger
  const logPath = `${process.cwd()}/${configFileLogger.fileName}`

  return {
    level: 'debug',
    colorize: false,
    filename: logPath,
    timestamp: true,
    maxsize: configFileLogger.maxsize ? configFileLogger.maxsize : 10485760,
    maxFiles: configFileLogger.maxFiles ? configFileLogger.maxFiles : 2,
    json: configFileLogger.hasOwnProperty('json') ? configFileLogger.json : false,
    eol: '\n',
    tailable: true,
    showLevel: true,
    handleExceptions: true,
    humanReadableUnhandledException: true
  }
}

/**********************************************************************
 * Returns a log.options object with a writable stream based on winston
 **********************************************************************/
logger.getMorganOptions = () => {
  return {
    stream: logger.stream
  }
}

/****************************************************************************
 * Returns the log.format option set in the current environment configuration
 ****************************************************************************/
logger.getLogFormat = () => {
  let format = conf.log && conf.log.format ? conf.log.format.toString() : 'combined'

  // make sure we have a valid format
  if (LOGGER_FORMATS.indexOf(format) === -1) {
    format = 'combined'
    if (process.env.NODE_ENV !== 'test') {
      console.log()
      console.log(chalk.yellow(`Warning: An invalid format was provided. The logger will use the default format of "${format}"`))
      console.log()
    }
  }
  return format
}

/**********************************************************************
 * Logger debug - handles debuggin when process.env.DEBUG_MODE === true
 **********************************************************************/
logger.debug = (log, type = 'info') => {
  const DEBUG_MODE = process.env.APP_DEBUG_MODE
  if (DEBUG_MODE) return logger[type](log)
  return false
}

/************************************************
 * Setup file logger
 ************************************************/
logger.setupFileLogger()

export default logger