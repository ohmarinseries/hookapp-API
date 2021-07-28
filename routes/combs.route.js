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

export default router;