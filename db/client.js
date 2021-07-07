import { Client } from "pg";
import dotenv from "dotenv"

dotenv.config();

const client = new Client({
    user : process.env.LOCAL_DB_USER,
    password : process.env.LOCAL_DB_PASSWORD,
    host : process.env.LOCAL_DB_HOST,
    port : 5555,
    database : process.env.LOCAL_DB_DATABASE
})

function connect() {
   return client.connect()
}

function disconnect() {
    client.end()
        .then(() => {
            console.log("Database disconnected")
        })
        .catch(error => {
            console.log("Failed to end connection", error)
        })
}



export default {
    'client' : client,
    'connect' : connect,
    'disconnect' : disconnect
}
