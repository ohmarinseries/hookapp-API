import express from "express";
import Joi from "@hapi/joi";

let router = express.Router();

import db from "../db/client"
import auth from "../middleware/check_token";

router.post('/', auth, async (req, res) => {
    const schema = Joi.object({
        base_ingredients : Joi.string()
                              .required()
                              .max(500),
        description :      Joi.string()
                              .required()
                              .min(10)
                              .max(1000) 
    });
    
    const {error} = Joi.validate(req.body.data, schema);
    if(error) return res.status(400).send(error.details[0].message);


    await db.client.query(`INSERT INTO flavourcombs (users_id, base_ingredients, description) VALUES (${req.body.data.id}, '${req.body.data.base_ingredients}', '${req.body.data.description}')`);
   
    let insertId = await (await db.client.query(`SELECT MAX(id) AS id FROM flavourcombs`)).rows[0].id;
    try{
    for(let i = 0 ; i < req.body.data.headingredient.length ; i++){
        await db.client.query(`INSERT INTO headingredients (combo_id, flavour_id, precentage) VALUES (${insertId}, ${req.body.data.headingredient[i].flavourid}, ${req.body.data.headingredient[i].precentage})`);
    }
    res.status(200).send('SUCCESS');
    }catch(err){
    res.status(500).send('ERROR', err);    
    }

});

router.delete('/:id', auth, async (req, res) => {
    try{
        await db.client.query(`DELETE FROM headingredients WHERE combo_id = ${req.params.id}`);
        await db.client.query(`DELETE FROM combcomments WHERE combo_id = ${req.params.id}`);
        await db.client.query(`DELETE FROM comblikes WHERE combo_id = ${req.params.id}`);
        await db.client.query(`DELETE FROM combdislikes WHERE combo_id = ${req.params.id}`);
        await db.client.query(`DELETE FROM combcomlikes WHERE combo_id = ${req.params.id}`);
        await db.client.query(`DELETE FROM combcomdislikes WHERE combo_id = ${req.params.id}`);
        await db.client.query(`DELETE FROM flavourcombs WHERE combo_id = ${req.params.id}`);

        res.status(200).send('Combination deleted!');
    }catch(err){
        res.status(500).send('Failed to delete combination!', err);
    }
});

router.put('/:id', auth, async (req, res) => {
    const schema = Joi.object({
        base_ingredients : Joi.string()
                              .required()
                              .max(500),
        description :      Joi.string()
                              .required()
                              .min(10)
                              .max(1000) 
    });
    
    const {error} = Joi.validate(req.body.data, schema);
    if(error) return res.status(400).send(error.details[0].message);

    try{
        await db.client.query(`UPDATE flavourcombs SET base_ingredients = '${req.body.data.base_ingredients}', description = '${req.body.data.description}' WHERE id = ${req.params.id}`);
    }catch(err){
        res.status(500).send('Error A');
    }

    await db.client.query(`DELETE FROM headingredients WHERE combo_id = ${req.params.id}`);

    try{
        for(let i = 0 ; i < req.body.data.headingredient.length ; i++){
            await db.client.query(`INSERT INTO headingredients (combo_id, flavour_id, precentage) VALUES (${req.params.id}, ${req.body.data.headingredient[i].flavourid}, ${req.body.data.headingredient[i].precentage})`);
        }
        res.status(200).send('SUCCESS');
    }catch(err){
        res.status(500).send('ERROR', err);    
        }


});

router.post('/like/:id', auth, async (req, res) => {
    let check = await db.client.query(`SELECT * FROM comblikes WHERE combo_id = ${req.params.id} and users_id = ${req.body.data.id}`);
    if(check.rows.length != 0){
        await db.client.query(`DELETE FROM comblikes WHERE combo_id = ${req.params.id} and users_id = ${req.body.data.id}`);
    }
    
    
     try{
       await db.client.query(`INSERT INTO combcomlikes (combo_id, users_id) VALUES (${req.params.id}, ${req.body.data.id})`);
       res.status(200).send('Like added to combination!');
     }catch(err){
       res.status(500).send('Fail!', err);
     }


});

router.post('/comment/:id', auth, async (req, res) => {
    const schema = Joi.object({
        comment : Joi.string()
                     .required()
                     .max(500)
    });
    
    const {error} = Joi.validate(req.body.data, schema);
    if(error) return res.status(400).send(error.details[0].message);

    try{
      await db.client.query(`INSERT INTO combcomments (combo_id, users_id, comment) VALUES (${req.params.id}, ${req.body.data.id}, '${req.body.data.comment}')`);
      res.status(200).send('Comment added on combination!');
    }catch(err){
      res.status(500).send('Failed to add comment on combination!', err);
    }

});

router.delete('/comment/:id', auth, async (req, res) => {
    try{
       await db.client.query(`DELETE FROM combcomlikes WHERE comment_id = ${req.params.id}`);
       await db.client.query(`DELETE FROM combcomdislikes WHERE comment_id = ${req.params.id}`);
       await db.client.query(`DELETE FROM combcomments WHERE id = ${req.params.id}`);
       
       res.status(200).send('Comment deleted!');

    }catch(err){
       res.status(500).send('Failed to delete comment!', err);
    }
});

router.post('/comment/like/:id', auth, async (req, res) => {
   
   let check = await db.client.query(`SELECT * FROM combcomdislikes WHERE comment_id = ${req.params.id} and users_id = ${req.body.data.id}`);
   if(check.rows.length != 0){
       await db.client.query(`DELETE FROM combcomdislikes WHERE comment_id = ${req.params.id} and users_id = ${req.body.data.id}`);
   }
   
   
    try{
      await db.client.query(`INSERT INTO combcomlikes (comment_id, users_id) VALUES (${req.params.id}, ${req.body.data.id})`);
      res.status(200).send('Like added to combination comment!');
    }catch(err){
      res.status(500).send('Fail!', err);
    }

});

router.post('/comment/dislike/:id', auth, async (req, res) => {

    let check = await db.client.query(`SELECT * FROM combcomlikes WHERE comment_id = ${req.params.id} and users_id = ${req.body.data.id}`);
    if(check.rows.length != 0){
        await db.client.query(`DELETE FROM combcomlikes WHERE comment_id = ${req.params.id} and users_id = ${req.body.data.id}`);
    }
    
    
     try{
       await db.client.query(`INSERT INTO combcomdislikes (comment_id, users_id) VALUES (${req.params.id}, ${req.body.data.id})`);
       res.status(200).send('DIslike added to combination comment!');
     }catch(err){
       res.status(500).send('Fail!', err);
     }

});

router.put('/comment/:id', auth, async (req, res) => {
    const schema = Joi.object({
        comment : Joi.string()
                     .required()
                     .max(500)
    });
    
    const {error} = Joi.validate(req.body.data, schema);
    if(error) return res.status(400).send(error.details[0].message);


    try{
        await db.client.query(`UPDATE combcomments SET comment = ${req.body.data.comment} WHERE comment_id = ${req.params.id} and users_id = ${req.body.data.id}`);
        res.status(200).send('Combination comment updated!');
    }catch(err){
        res.status(500).send('Failed to update comment!', err);
    }

});



export default router;