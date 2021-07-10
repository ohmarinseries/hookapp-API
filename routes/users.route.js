import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import {registerSchema} from "../validate"
import Joi from "@hapi/joi";

const router = express.Router();

import db from "../db/client"


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
   
    
  let emailCheck = await db.client.query(`SELECT * FROM users WHERE "email" = '${req.body.data.email}'`)
    if(emailCheck.rows.length != 0) return res.status(400).send('Email already exists'); 
    
  let userNameCheck = await db.client.query(`SELECT * FROM users WHERE "username" = '${req.body.data.username}'`);
    if(userNameCheck.rows.length != 0) return res.status(400).send('Username already exists');  

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.data.password, salt);
  
    try{
        let dbres = db.client.query(`INSERT INTO "users" ("username", "email", "pass") VALUES ('${req.body.data.username}', '${req.body.data.email}', '${hashedPassword}')`);
          res.status(200).send(dbres);        
      }catch(err){
          res.status(400).send(err);
          }    

    })

export default router