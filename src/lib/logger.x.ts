import { LoggerInstance, LoggerOptions } from 'winston'

export interface Logger extends LoggerInstance {
  stream: any
  setupFileLogger?: () => boolean
  getLogOptions?: () => LoggerOptions
  getMorganOptions?: () => { stream: any }
  getLogFormat?: () => string
}