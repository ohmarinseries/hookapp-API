import path from "path"
import dotenv from "dotenv"
import migratetool from "sql-migrations"

dotenv.config();

migratetool.run({
  migrationsDir: path.resolve(__dirname, "migrations"), 
  host: process.env.LOCAL_DB_HOST, 
  port: 5555, 
  db: process.env.LOCAL_DB_DATABASE, 
  user: process.env.LOCAL_DB_USER, 
  password: process.env.LOCAL_DB_PASSWORD, 
  adapter: "pg", 
});