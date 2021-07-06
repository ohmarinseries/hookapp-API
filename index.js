import express from "express"
import client from "./db/client"
import dotenv from "dotenv"
import morgan from "morgan"

dotenv.config();

const app = express();
app.use(express.json({limit : "50mb"}));
app.use(express.urlencoded({limit : "50mb", extended : true}));

if(process.env.ENV === "local"){
    app.use(morgan('tiny'));
}

app.get('/', (req, res) => {
    res.send('Connection Established');
});

client.connect()
.then(() => console.log('Connected'))
.catch(error => console.error(error))
.finally(() => client.end())


app.listen(process.env.PORT, () => {console.log('Listening to the port 3000')});