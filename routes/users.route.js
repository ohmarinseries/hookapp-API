import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
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

 router.put('/updateprofile', auth, async (req, res) => {

  let user = await db.client.query(`SELECT * FROM users WHERE id = ${req.body.data.id}`);

  let usernameCheck = await db.client.query(`SELECT * FROM users WHERE username = '${req.body.data.username}'`);
  if(usernameCheck.rows.length != 0) return res.status(400).send('Username already in use');

  if(req.body.data.username === undefined) req.body.data.username = user.rows[0].username;
  if(req.body.data.description === undefined) req.body.data.description = user.rows[0].description;

  await db.client.query(`UPDATE "users" SET 
  "username" = '${req.body.data.username}',
  "description" = '${req.body.data.description}'
  WHERE "id" = ${req.body.data.id}`);  
  
  res.status(200).send('Updated user info');

 }) 

router.get('/profile/:id', auth, async (req, res) => {
 let Data = {
    profileInfo : [],
    posts : []
  }
  Data.profileInfo = await (await db.client.query(`SELECT * FROM users WHERE id = ${req.params.id}`)).rows;
  Data.posts = await (await db.client.query(`SELECT * FROM posts WHERE users_id = ${req.params.id}`)).rows;
 
  res.status(200).send(Data);

})

router.post('/follow/:id', auth, async (req, res) => {


})

router.delete('/unfollow/:id', auth, async (req, res) => {

})

export default router