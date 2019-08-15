import conf from './src/conf'
import express from './src/lib/express'
import mongoose from './src/lib/mongoose'
import chalk from 'chalk'
export { default } from './src/lib/logger'

/************************************************
 * Connect mongoose
 ************************************************/
export function listen() {
  mongoose.loadModels()
  mongoose.connect().then(db => { initApp(express(db)) })
}

/************************************************
 * Init application
 ************************************************/
function initApp(app) {
  const SERVER_URI = `${conf.app.protocol}://${conf.app.host}:${conf.app.port}`
  app.listen(conf.app.port, conf.app.host)
  console.log('--')
  console.log(chalk.green(conf.app.title))
  console.log(chalk.green(`Environment:         ${process.env.NODE_ENV}`))
  console.log(chalk.green(`Server:              ${SERVER_URI}`))
  console.log(chalk.green(`Database:            ${conf.db.uri}`))
  console.log(chalk.green(`App version:         ${conf.app.version}`))
  console.log('--')
}