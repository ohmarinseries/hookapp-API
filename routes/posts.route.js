import express from "express"
import cloudinary from "../config/cloudinary";

const router = express.Router();

import db from "../db/client"
import auth from "../middleware/check_token";

router.post('/post', auth, async (req, res) => {
    let barsid = req.body.data.barsid
    if(req.body.data.barsid === undefined) barsid = null;  

   db.client.query(`INSERT INTO posts (users_id, bars_id, description) VALUES (${req.body.data.id}, ${barsid}, '${req.body.data.description}')`);
   
    let insertId = await (await db.client.query(`SELECT MAX(id) AS id FROM posts`)).rows[0].id;
    let uploadRes
    try{
        uploadRes = await cloudinary.uploader.upload(req.body.data.imagebase64,
            {
            upload_preset: 'defaultpreset'
    
            }) 
       
        }catch(error){
            res.status(400).send('Upload Failed!');
        }

      try{
       await db.client.query(`INSERT INTO postimages (post_id, image_url) VALUES (${insertId}, '${uploadRes.url}')`);
       res.status(200).send('Posted');
      } catch(error){
          console.error(error);
        res.status(400).send('Post failed');
      } 


})

export default router;