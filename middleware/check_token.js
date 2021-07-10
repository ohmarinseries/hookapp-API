import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

function auth(req, res, next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access denied');

    try{
     const verified = jwt.verify(token, process.env.TOKEN_SECRET);

      req.user = verified;  

      next();  

    }catch(error){
        res.status(400).send('Invalid token');
    }

}

export default auth