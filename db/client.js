import { Client } from "pg";

const client = new Client({
    user : 'postgres',
    password : '25omar03',
    host : 'localhost',
    port : 5555,
    database : 'postgres'
})

export default client