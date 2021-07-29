import express from "express";
import Joi from "@hapi/joi";
import cloudinary from "cloudinary";

let router = express.Router();

import db from "../db/client"
import auth from "../middleware/check_token";

router.post('/', auth, async (req, res) => {
    const schema = Joi.object({
        image64 : Joi.string()
                     .required()
    });
    
    const {error} = Joi.validate(req.body.data, schema);
    if(error) return res.status(400).send(error.details[0].message);
   
    let uploadResponse;

    try{
        uploadResponse = await cloudinary.uploader.upload(req.body.data.image64,
            {
            upload_preset: 'defaultpreset'
    
            }) 
        res.status(200).send(uploadResponse.url, 'Upload Successful')    
       
        }catch(err){
            res.status(500).send('Upload Failed!', err);
        }

})

export default router;