import conf from './conf/conf'
import express from './lib/express'
import mongoose from './lib/mongoose'
import chalk from 'chalk'
import logger from './lib/logger'

export { parseError } from './utils'
export const { debug } = logger

/************************************************
 * Init application
 ************************************************/
function initApp(app) {
  const SERVER_URI = `${conf.app.protocol}://${conf.app.host}:${conf.app.port}`
  app.listen(conf.app.port, conf.app.host)
  console.log('---------------------------------------------------------')
  console.log(chalk.green(conf.app.title))
  console.log(chalk.green(`Environment:         ${process.env.NODE_ENV}`))
  console.log(chalk.green(`Server:              ${SERVER_URI}`))
  console.log(chalk.green(`Database:            ${conf.db.uri}`))
  console.log('---------------------------------------------------------')
}

/************************************************
 * Startup
 ************************************************/
export default function mts() {
  mongoose.loadModels()
  mongoose.connect().then(() => { initApp(express()) })
}