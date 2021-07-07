const clinetFile = require('./client');
const migrator = require("postgres-migrations");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config()

module.exports = async () => {
 let db_config = {}

  clinetFile.default.connect()
      .then(() => {
          db_config = {
              user: clinetFile.default.client.user,
              password: clinetFile.default.client.password,
              host: clinetFile.default.client.host,
              port: clinetFile.default.client.port,
              database: clinetFile.default.client.database, 
          }
          console.log("Started Migrations")
          return migrator.migrate(db_config, path.resolve(__dirname, 'migrations'))
      })
      .then(() => {
          console.log("Migrations successful")
      })
      .catch(error => {
          console.log("Database migrations failed")
          console.log(error)
          

          clinetFile.default.disconnect()
      })
}