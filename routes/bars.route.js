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

router.post('/login', async (req, res) => {

      let loginData = await db.client.query(`SELECT * FROM bars WHERE email = '${req.body.data.email}'`);
  
      if(loginData.rows.length === 0) return res.status(404).send('User not found');
  
      let validPassword = await bcrypt.compare(req.body.data.password, loginData.rows[0].pass);
      if(!validPassword) return res.status(400).send('Invalid Password');
  
      const token = jwt.sign({'id' : loginData.rows[0].id}, process.env.TOKEN_SECRET);
  
      res.header('auth-token', token).send(token);
  
    })

router.post('/gallery', auth, async (req, res) => {
  const schema = Joi.object({
    imageurl : Joi.string()
                  .required()             
});

const {error} = Joi.validate(req.body.data, schema);
if(error) return res.status(400).send(error.details[0].message);

try{
await db.client.query(`INSERT INTO bargallery (bars_id, image_url) VALUES (${req.body.data.id}, "${req.body.data.imageurl}")`)
res.status(200).send('Image added to gallery!');

}catch(error){
res.status(500).send('Failed to insert into gallery!', error);
}
})

router.get('/:id', auth, async (req, res) => {
 let Data = {
    profile : [],
    gallery : []
  }
    try{
    Data.profile = await db.client.query(`SELECT *, hookahcompanys.company FROM bars 
     INNER JOIN hookahcompanys
     ON hookahcompanys.id = bars.hookah_id
     WHERE bars.id = ${req.params.id}
     `);
    Data.gallery = await db.client.query(`SELECT * FROM bargallery WHERE bars_id = ${req.params.id}`);
    res.status(200).send(Data);
    }catch(error){
    res.status(500).send('Failed to get bar!', error);
    }
});

router.put('/updateprofile', auth, async (req, res) => {
  const schema = Joi.object({
    barname : Joi.string()
                  .required()
                  .min(3)
                  .max(20),
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

try{
  await db.client.query(`UPDATE bars SET
  bar_name = '${req.body.data.barname}',
  city = '${req.body.data.city}',
  street_address = '${req.body.data.address}'
  WHERE id = ${req.body.data.id}
  `)
  res.status(200).send('Bar profile successfully updated!');

}catch(err){
  res.status(500).send('Failed to update bar profile!', err);
}
});