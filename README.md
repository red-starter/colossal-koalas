# Moodlet

A platform for mood-tracking, microjournaling, self-reflection, and mindfulness.

## Team

Cynthia Chen [@cynthiaechen](https://github.com/cynthiaechen)

Laura Knight [@ljknight](https://github.com/ljknight)

Cameron Martin [@camhux](https://github.com/camhux)

Michael Sova [@red-starter](https://github.com/red-starter)


## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

To run the server in production mode, first install the production dependencies:
`npm install -p`

Then, the server can be started with `npm start`. Two additional environment variables must be set for the server to run. Set `DATABASE_URL` to the proper database for your Postgres/MySQL server, and set `TOKEN_SECRET` to some string you'd like used to create JWTs for session authentication.

## Requirements

Server:
- Node >0.12.0
- Express >4.0.0
- Sequelize >2.0.0

Client:
- Angular (with ui-router)
- D3

## Development

### Installing Dependencies

From within the root directory:
`npm install`

### Gulp Scripts

Several useful developer scripts are configured in `gulpfile.js`. You must configure a `.env.json` for these to work, however, which will contain the same environment variables required for the server to run normally. See `example.env.json` for a template.

`gulp start` will run the local server in production mode without you needing to manually set the environment variables.

`gulp dev-start` will run the local server in test mode (which connects to a separate, always-wiped-clean database schema), with `nodemon` instead of `node` to watch for changes.

`gulp test` will start the server in test mode, run `server/spec/spec.js` against the server's API endpoints, then stop the server.

`gulp db-test` will start just the database interface in test mode (which connects to the same separate, always-clean schema as before), and then run `server/database/spec/spec.js` against the Sequelize interface to the database.

`gulp db-reset` will start the database interface in reset mode, which will **drop all tables in the *live schema*, not the test schema** and then exit the process. Use this should you ever need to fix the tables of your database's main schema.

### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
