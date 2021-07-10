import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import {registerSchema} from "../validate"
import Joi from "@hapi/joi";

const router = express.Router();

import db from "../db/client"
import auth from "../middleware/check_token";


router.post('/register', async (req, res) => {

    const schema = Joi.object({
        username : Joi.string()
                      .required()
                      .min(3)
                      .max(20),
        email :    Joi.string()
                      .required()
                      .email(),
        password : Joi.string()
                      .required()
                      .min(6)
                      .max(30)  
    });
    
    const {error} = Joi.validate(req.body.data, schema);
    if(error) return res.status(400).send(error.details[0].message);
   
    
  let emailCheck = await db.client.query(`SELECT * FROM users WHERE email = '${req.body.data.email}'`)
    if(emailCheck.rows.length != 0) return res.status(400).send('Email already exists'); 
    
  let usernameCheck = await db.client.query(`SELECT * FROM users WHERE username = '${req.body.data.username}'`);
    if(usernameCheck.rows.length != 0) return res.status(400).send('Username already exists');  

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.data.password, salt);
  
    try{
        let dbres = db.client.query(`INSERT INTO users ("username", "email", "pass") VALUES ('${req.body.data.username}', '${req.body.data.email}', '${hashedPassword}')`);
          res.status(200).send('User created');        
      }catch(err){
          res.status(400).send(err);
          }    

    })


  router.post('/login', async (req, res) => {

    let loginData = await db.client.query(`SELECT * FROM users WHERE email = '${req.body.data.email}'`);

    if(loginData.rows.length === 0) return res.status(404).send('User not found');

    let validPassword = await bcrypt.compare(req.body.data.password, loginData.rows[0].pass);
    if(!validPassword) return res.status(400).send('Invalid Password');

    const token = jwt.sign({'id' : loginData.rows[0].id}, process.env.TOKEN_SECRET);

    res.header('auth-token', token).send(token);

  })

  

export default router