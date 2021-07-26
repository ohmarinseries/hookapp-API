import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import Joi from "@hapi/joi";

const router = express.Router();

import db from "../db/client"
import auth from "../middleware/check_token";

router.post('/register', async (req, res) => {

    const schema = Joi.object({
        barname : Joi.string()
                      .required()
                      .min(3)
                      .max(20),
        email :    Joi.string()
                      .required()
                      .email(),
        password : Joi.string()
                      .required()
                      .min(6)
                      .max(30),
        city :     Joi.string()
                      .required()
                      .min(2)
                      .max(30),
        address :  Joi.string()
                      .required()
                      .min(3)
                      .max(50)                
    });
    
    const {error} = Joi.validate(req.body.data, schema);
    if(error) return res.status(400).send(error.details[0].message);
   
    
  let emailCheck = await db.client.query(`SELECT * FROM bars WHERE email = '${req.body.data.email}'`)
    if(emailCheck.rows.length != 0) return res.status(400).send('Email already exists'); 
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.data.password, salt);
  
    try{
        db.client.query(`INSERT INTO users ("bar_name", "email", "pass", "profile_image") VALUES ('${req.body.data.username}', '${req.body.data.email}', '${hashedPassword}', '${req.body.data.imageurl}')`);
          res.status(200).send('User created');        
      }catch(err){
          res.status(500).send(err);
          }    

    })