import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import cors from "cors"
import client from "./db/client"
import userRoutes from "./routes/users.route"

dotenv.config();

const app = express();
app.use(express.json({limit : "50mb"}));
app.use(express.urlencoded({limit : "50mb", extended : true}));

app.use(cors());

if(process.env.ENV === "local"){
    app.use(morgan('tiny'));
}

app.get('/', (req, res) => {
   
});

app.use('/user', userRoutes);

require("./db/migrate-dev")();


app.listen(process.env.PORT, () => {console.log('Listening to the port 3000')});