import conf from '../conf/conf'
import chalk from 'chalk'
import path from 'path'
import mongoose from 'mongoose'

function mongooseConf() {}

/************************************************
 * Load the mongoose models
 ************************************************/
mongooseConf.loadModels = (callback?) => {
  console.log('---------------------------------------------------------')
  conf.assets.models.forEach(modelPath => {
    console.log(chalk.green(`+ ADDED - Mongoose Model: ${modelPath}`))
    require(path.join(process.cwd(), modelPath))
  })

  if (callback) { callback() }
}


/************************************************
 * Initialize mongoose
 ************************************************/
mongooseConf.connect = async () => {
  try {
    await mongoose.connect(conf.db.uri, conf.db.options)
  } 
  catch(err) {
    console.error(chalk.red('Could not connect to MongoDB!'))
    console.log(err)
  }
}

/************************************************
 * Handle mongoose disconnect
 ************************************************/
mongooseConf.disconnect = cb => {
  mongoose.disconnect(err => {
    console.info(chalk.yellow('Disconnected from MongoDB.'))
    cb(err)
  })
}

export default mongooseConf
