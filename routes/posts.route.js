import express from "express"

const router = express.Router();

import db from "../db/client"
import auth from "../middleware/check_token";

router.post('/post', auth, async (req, res) => {
    let barsid = req.body.data.barsid
    if(req.body.data.barsid === undefined) barsid = null;  

   db.client.query(`INSERT INTO posts (users_id, bars_id, description) VALUES (${req.body.data.id}, ${barsid}, '${req.body.data.description}')`);
   
    let insertId = await (await db.client.query(`SELECT MAX(id) AS id FROM posts`)).rows[0].id;
    
      try{
       await db.client.query(`INSERT INTO postimages (post_id, image_url) VALUES (${insertId}, '${req.body.data.imageurl}')`);
       res.status(200).send('Posted');
      } catch(error){
          console.error(error);
        res.status(500).send('Post failed');
      } 


})

router.post('/comment/:id', auth, async (req, res) => {
    const schema = Joi.object({
        comment : Joi.string()
                     .required()          
    });
    
    const {error} = Joi.validate(req.body.data, schema);
    if(error) return res.status(400).send(error.details[0].message);

    try{
     await db.client.query(`INSERT INTO comments (post_id, users_id, comment) VALUES (${req.params.id}, ${req.body.data.id}, '${req.body.data.comment}')`);
     res.status(200).send('Comment Posted!');
    }catch(err){
     res.status(500).send('Failed to post comment', err);
    }

});

router.delete('/comment/:id', auth, async (req, res) => {
    try{
     await db.client.query(`DELETE FROM comments WHERE id = ${req.params.id}`);
     res.status(200).send('Comment deleted!');
    }catch(err){
     res.status(500).send('Failed to delete comment!', err);
    }
})

router.post('/like/:id', auth, async (req, res) => {
    try{
     await db.client.query(`INSERT INTO likes (post_id, users_id) VALUES (${req.params.id}, ${req.body.data.id})`);
     res.status(200).send('Like added');
    }catch(err){
     res.status(500).send('Failed to like post', err);
    }
});

router.delete('/like/:id', auth, async (req, res) => {
    try{
        await db.client.query(`DELETE FROM likes WHERE post_id = ${req.params.id} AND users_id = ${req.body.data.id}`);
        res.status(200).send('Like removed');
       }catch(err){
        res.status(500).send('Failed to remove like', err);
       }
});

router.delete('/:id', auth, async (req, res) => {
    try{
     await db.client.query(`DELETE FROM likes WHERE post_id = ${req.params.id}`);
     await db.client.query(`DELETE FROM comments WHERE post_id = ${req.params.id}`);
     await db.client.query(`DELETE FROM posttags WHERE post_id = ${req.params.id}`);
     await db.client.query(`DELETE FROM postimages WHERE post_id = ${req.params.id}`);
     await db.client.query(`DELETE FROM posts WHERE id = ${req.params.id}`);

     res.status(200).send('Post successfully deleted!');
    }catch(err){
     res.status(500).send('Failed to delete commet!', err);
    }
});

router.put('/:id', auth, async (req, res) => {
    const schema = Joi.object({
        description : Joi.string()
                     .required()          
    });
    
    const {error} = Joi.validate(req.body.data, schema);
    if(error) return res.status(400).send(error.details[0].message);

    try{
        await db.client.query(`UPDATE posts SET description = '${req.body.data.description}' WHERE id = ${req.params.id}`);
        res.status(200).send('Post Updated!');
    }catch(err){
        res.status(500).send('Failed to update!', err);
    }

});

export default router;