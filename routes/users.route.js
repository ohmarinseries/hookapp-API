import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import Joi from "@hapi/joi";
import nodemailer from "nodemailer";
import randomstring from "randomstring";
import dotenv from "dotenv";


const router = express.Router();

import db from "../db/client"
import auth from "../middleware/check_token";

dotenv.config();

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
    if(emailCheck.rows.length !== 0) return res.status(400).send('Email already exists');
    
  let usernameCheck = await db.client.query(`SELECT * FROM users WHERE username = '${req.body.data.username}'`);
    if(usernameCheck.rows.length !== 0) return res.status(400).send('Username already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.data.password, salt);

    let cloneString;

    const verficationString = randomstring.generate({
        'charset': 'alphanumeric',
        'length': 100
    });
    try {
        cloneString = await db.client.query(`SELECT * FROM tokens WHERE token = '${verficationString}'`);
    }catch (error) {
        console.error(error)
    }
    console.log(verficationString);

    while(cloneString.rows.length !== 0) {

        const verficationString = randomstring.generate({
            'charset': 'alphanumeric',
            'length': 100
        });
        try {
      cloneString = await db.client.query(`SELECT * FROM tokens WHERE token = '${verficationString}'`);
        }catch (error) {
         console.error(error)
        }
        console.log(verficationString);
    }

        let transporter = nodemailer.createTransport({
            host: 'smtppro.zoho.eu',
            port: 587,
            secure: false,
            auth: {
                user: 'omar@debugger.team',
                pass: `${process.env.EMAIL_PASS}`
            },
            tls:{
                rejectUnauthorized:false
            }
        });


        let mailOptions = {
            from: 'omar@debugger.team',
            to: 'omar.hurem@gmail.com',
            subject: 'Email verification',
            text: 'Click the link below',
            html: `
            <a href="http://localhost:3000/user/verify-email?token=${verficationString}">Verify Email</a>
            `
        };

   await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    });

  
    try{
        db.client.query(`INSERT INTO users ("username", "email", "pass", "profile_image") VALUES ('${req.body.data.username}', '${req.body.data.email}', '${hashedPassword}', '${req.body.data.imageurl}')`);
          res.status(200).send('User created');        
      }catch(err){
          res.status(500).send(err);
          }
     let dbuser;
     try{
      dbuser = await db.client.query(`SELECT "id" FROM users WHERE "email" = '${req.body.data.email}'`);

     }catch(err){
      console.error(err);
     }

     try{
        await db.client.query(`INSERT INTO tokens ("users_id", "token") VALUES (${dbuser.rows[0].id}, '${verficationString}')`);
     }catch(err){
      console.error(err);
     }


    })


  router.post('/login', async (req, res) => {

    let loginData = await db.client.query(`SELECT * FROM users WHERE email = '${req.body.data.email}'`);

    if(loginData.rows.length === 0) return res.status(404).send('User not found');

    let validPassword = await bcrypt.compare(req.body.data.password, loginData.rows[0].pass);
    if(!validPassword) return res.status(400).send('Invalid Password');

    const token = jwt.sign({'id' : loginData.rows[0].id}, process.env.TOKEN_SECRET, {expiresIn: '48h'});

    res.header('auth-token', token).send(token);

  })

 router.put('/updateprofile', auth, async (req, res) => {

  let user = await db.client.query(`SELECT * FROM users WHERE id = ${req.body.data.id}`);

  let usernameCheck = await db.client.query(`SELECT * FROM users WHERE username = '${req.body.data.username}'`);
  if(usernameCheck.rows.length !== 0) return res.status(400).send('Username already in use');

  if(req.body.data.username === undefined) req.body.data.username = user.rows[0].username;
  if(req.body.data.description === undefined) req.body.data.description = user.rows[0].description;
  try{
  await db.client.query(`UPDATE "users" SET 
  "username" = '${req.body.data.username}',
  "description" = '${req.body.data.description}'
  WHERE "id" = ${req.body.data.id}`);  
  
   res.status(200).send('Updated user info');
  }catch(err){
   res.status(500).send('Update Failed', err);
  }
 }) 

router.get('/profile/:id', auth, async (req, res) => {
 let Data = {
    profileInfo : [],
    posts : [],
    followerCount : [],
    followState : false
  }
  let followCheck;
try{
  Data.profileInfo = await (await db.client.query(`SELECT * FROM users WHERE id = ${req.params.id}`)).rows;
  Data.posts = await (await db.client.query(`SELECT * FROM posts WHERE users_id = ${req.params.id}`)).rows;
  Data.followerCount = await (await db.client.query(`SELECT COUNT(id) AS followernum FROM followers WHERE users_id = ${req.params.id}`)).rows[0].followernum;
  
  followCheck = await (await db.client.query(`SELECT * FROM followers WHERE users_id = ${req.params.id}`)).rows;
  if(followCheck.length != 0) Data.followState = true;

  res.status(200).send(Data);
  }catch(err){
  res.status(500).send('Failed to get profile info!', err);
  }
})

router.post('/follow/:id', auth, async (req, res) => {
   try{
    await db.client.query(`INSERT INTO followers (users_id, follow_id) VALUES (${req.params.id}, ${req.body.data.id})`);
     res.status(200).send('User Followed');
   }catch(err){
     res.status(500).send('Follow Failed', err);
   }
})

router.delete('/unfollow/:id', auth, async (req, res) => {
  try{
   await db.client.query(`DELETE FROM followers WHERE users_id = ${req.params.id} and follow_id = ${req.body.data.id}`);
    res.status(200).send('User Unfollowed');
  }catch(err){
    res.status(500).send('Unfollow Failed', err);
  }

})


router.put('/updateprofilepicture', auth, async (req, res) => {
  
    try{
      db.client.query(`UPDATE users SET profile_image = '${req.body.data.imageurl}' WHERE id = ${req.body.data.id}`);
      res.status(200).send('Image Updated');
     }catch(err){
      res.status(500).send('Update Failed', err);
     }  


})


router.get('/verify-email', async (req, res) => {
    let dbres;
    try{
      dbres = await db.client.query(`SELECT "users_id" FROM tokens WHERE "token" = '${req.query.token}'`);
    }catch (error){
      console.error(error);
    }

    console.log(dbres);
    try{
    await db.client.query(`UPDATE users SET "verification" = 1 WHERE "id" = ${dbres.rows[0].users_id}`);
    res.status(200).send("Email Verified");
    }catch (error){
     console.error(error);
    res.status(500).send("Verification Failed!");
    }



})

export default router