import conf from '../conf/conf'
import path from 'path'
import http from 'http'
import socketio from 'socket.io'
import logger from './logger'
import chalk from 'chalk'

/************************************************
 * Array of connected clients
 ************************************************/
const clients = []

/************************************************
 * Socket.io confuration
 ************************************************/
export default (app, sessionConfig)  => {
  const server = http.createServer(app)
  
  // Create a new Socket.io server
  const io = socketio.listen(server, {
    pingTimeout: 60000
  })

  // Add session info to request
   io.use((socket, next) => {
     sessionConfig(socket.request, socket.request.res, next)
   })

  // Add an event listener to the 'connection' event
  io.on('connection', (socket) => {

    logger.debug(`SOCKET CONNECTION: ${socket.id}`)
    console.log('SOCKET CLIENTS', clients)

    conf.assets.sockets.forEach((socketPath) => {
      console.log(chalk.green(`+ ADDED - Sockets: ${socketPath}`))
      require(path.resolve(socketPath))(io, socket, clients)
    })
    
    socket.on('disconnect', () => { 
      logger.debug(`SOCKET DISCONNECT: ${socket.id}`) 
      clients.forEach((client: any, key: number) => {
        if (client.socketId == socket.id) clients.splice(key, 1)
        console.log('SOCKET CLIENTS', clients)
      })
    })
  })
  return server
}