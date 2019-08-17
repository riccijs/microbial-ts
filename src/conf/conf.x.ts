export interface Conf {

  // Application 
  app: {
    title: string
    description: string
    port: string
    host: string
    protocol: string
    version: string
  }

  // Database 
  db: {
    uri: string
    options: {
      user: string
      pass: string
      useNewUrlParser: boolean
      useCreateIndex: boolean
    }
  }

  // Session 
  sessionCookie: {
    maxAge: number
    httpOnly: boolean
    secure: boolean
  }
  sessionSecret: string
  sessionKey: string
  sessionCollection: string

  // CSRF 
  csrf: {
    csrf: boolean
    csp: boolean
    xframe: string
    p3p: string
    xssProtection: boolean
  }

  // Logging
  log: {
    format: string
    fileLogger: {
      fileName: string
      maxsize: number
      maxFiles: number
      json: boolean
    }
  }

  // SSL
  secure: {
    ssl: boolean
    privateKey: string
    certificate: string
  },

  // Live reload
  livereload: boolean

  // Assets
  assets: {
    models: string[]
    routes: string[]
    sockets: string[]
    express: string[]
    policies: string[]
  }
}