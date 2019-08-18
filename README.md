Microbial-TS
=============
A simple/light weight microservices framework for NodeJS, Express, Socket.io, and MongoDB.

[![npm module](https://img.shields.io/npm/v/microbial-ts/latest.svg)](https://www.npmjs.org/package/microbial-ts)
[![dependencies](https://david-dm.org/riccijs/microbial-ts.svg)](https://david-dm.org/riccijs/microbial-ts)



About Microbial-TS?
----------

Microbial-TS allows engineers and developers the ability to spin-up new servers, quickly and efficiently, while not having
to worry about maintaining the core mechanisms. It allows for managing multiple environments, security policies, api routes, and data management (using MongoDB). It also assumes that you are familiar with MongoDB, Mongoose, Express, and Socket.io. If you are new to this type of thing, I've provide several resorces below, to get you started. MTS can be utilized for both microservices and SOA (Service Oriented Architecture) approaches and methodologies, and provides a simple solution for managing multiple service layers. Even though it contains "TS" (Typescript) in its name, typescript is optional, as I try to stay away from opinionated beliefs. 


Please check back frequently for updates, as this is in its beginning stages. 



Installation
------------

To use with node:

```bash
npm install microbial-ts --save
```

Javascript:

```javascript
const mts = require('microbial-ts')
```

ES6 and above:

```javascript
import mts from 'microbial-ts'
```


Prerequisites
-------------
- In order to use Microbial-TS, you must install and run [MongoDB](https://www.mongodb.com/download-center/community)!
- Microbial-TS uses ENVs to set it's configuration (see "Manual" for more). Windows users will need to use [cross-env](https://www.npmjs.com/package/cross-env).

Manual
-------------
This section covers specifics on how to configure Microbial-TS (for multiple deployment environments), recommendations of using Reverse Proxy (for microservices delployed to a single server), creating controllers, api routes and security policies.

### Setup
After installing Microbial-TS, you will need to create a nodemon.json file add a few things to your package.json. The following is an example of a common setup configuration.

#### Create a nodemon.json file
The following is specific to using Typescript and assumes that you have created a "src" folder, within the root of your services application (./src). Create a new file titled nodemon.json and add the following:

nodemon.json
```json
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "NODE_ENV=local ts-node src/index.ts"
}
```

Notice the NODE_ENV! This determines what config file is used when starting the service. Config files are explained later in this section.

#### Your package.json should look similar to the following:

package.json
```json
{
  "name": "my-awesome-microservices",
  "version": "0.1.0",
  "author": "Me",
  "description": "This is going to be awesome",
  "scripts": {
    "start-local": "nodemon --config \"./nodemon.json\"/",
  },
  "dependencies": {
    "microbial-ts": "^0.2.1"
  },
  "devDependencies": {
    "@types/chalk": "^2.2.0",
    "@types/glob": "^7.1.1",
    "@types/node": "^12.7.1",
    "nodemon": "^1.19.1",
    "ts-node": "^8.3.0",
    "tslint": "^5.18.0",
    "typescript": "^3.5.3"
  }
}

```

The "start-local" command will run the exec from your nodemon.json config file.

### Create a config file:
Microbial allows for creating configs for as many deployment environments that you may need. Most companies utilize three common environments: "local", "qa", and "production". My employer utilizes five seperate environments. This is the reason I've put a lot of thought into how to run multiple configurations. Below is an example of a config file for a local environment:

Create a config file titled ".env.local". THE NAME OF THIS FILE EXTREMELY IMPORTANT! For each deployment environment, you will need a new config file. e.g. .env.qa, .env.production. These files often contain sensitive information and therefore should be added to your .gitignore file.

.env.local
```text
APP_TITLE=My Application Microservices
APP_DESCRIPTION=Microservices for some needed business logic and data
APP_PORT=8000
APP_HOST=127.0.0.1
APP_PROTOCOL=http
APP_VERSION=0.1.0
APP_DEBUG_MODE=true

DATABASE_URI=mongodb://127.0.0.1
DATABASE_USER=
DATABASE_PWD=
DATABASE_NEW_URL_PARSER=true
DATABASE_CREATE_INDEX=true

SESSION_COOKIE_EXPIRATION=10800000
SESSION_COOKIE_HTTP_ONLY=true
SESSION_COOKIE_SECURE=false
SESSION_SECRET=CHANGETHIS
SESSION_KEY=sessionId
SESSION_COLLECTION=sessions

CSRF_CSRF=false
CSRF_CSP=false
CSRF_P3P=CHANGETHIS
CSRF_XFRAME=SAMEORIGIN
CSRF_XSS_PROTECTION=true

LOG_FORMAT=dev
LOG_FILE_NAME=app.log
LOG_MAX_SIZE=10485760
LOG_MAZ_FILES=2
LOG_JSON_OUTPUT=false

SECURE_SSL=true
SECURE_PRIVATE_KEY=src/ssl/server.key
SECURE_CERTIFICATE=src/ssl/server.cert

LIVE_RELOAD=true

ASSETS_MODELS=src/modules/*/model.ts
ASSETS_ROUTES=src/modules/*/routes.ts
ASSETS_SOCKETS=src/modules/*/sockets.ts
ASSETS_EXPRESS=src/modules/*/exp.ts
ASSETS_POLICIES=src/modules/*/policy.ts
```
For SSL support, you will need to add your key and cert to the paths listed for ENVs SECURE_PRIVATE_KEY and SECURE_CERTIFICATE

#### Create an entry point
Create a file for the entry point. Assuming you have followed the instruction above, in this example your entry point would be ./src/index.ts

./src/index.ts
```js
import mts from 'microbial-ts'

mts()
```

#### Starting the service:
```bash
npm run start-local
```

#### Creating a module:
In this example, we will need to create a folder that contains our modules (titled: "modules"), and a folder for our specific module.

./src/modules/user

Here you will be able to add a controller.ts file, model.ts (for Mongoose/MongoDB Schemas), policy.ts(api access security policy), and routes.ts(api route file).

#### Creating an API route and controller:

./src/modules/user/controller.ts
```js
function UserController() {}

UserController.read = () => {
  return {
    username: 'John Doe',
    emailAddress: 'john@someemailaddress.com'
  }
}

export default UserController
```

./src/modules/user/routes.ts
```javascript
import UserController from './controller.ts'

module.exports = app => {
  app.route('/api/user/read').get(
    async (req, res) => {
      try {
        const results = await UserController.read()
        res.status(200).json(results)
      } catch (e) {
        res.status(400).json(e)
      }
    }
  )
}
```

... and Viola! Please STAR THIS ON GITHUB to show your support! :)

Acknowledgements
-----------------

Created by Bryan Ricci
License [MIT](https://opensource.org/licenses/MIT).
