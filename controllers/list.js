import dayjs from  'dayjs';
import db from '../db/db.js'
import joi from 'joi';
import { ObjectId } from 'mongodb';

const postSchema = joi.object({
    idUser: joi.required(),
    description: joi.string().required(),
    type: joi.string().min(1).required(),
    value: joi.required(),
    day: joi.required(),
});

export async function getList (req,res){
    const user = res.locals.user;
    delete user.senha;
    let posts = await db.collection('list').find({idUser: user._id}).toArray();
    res.send(posts)
}

export async function postList(req,res){
    const {value, type, description} = req.body;
    const user = res.locals.user;

    const day = dayjs().format('DD/MM');

    const objPost = {
    value,
    description,
    type,
    day,
    idUser: user._id
   };
   const validation = postSchema.validate(objPost);
   if(validation.error){
    res.status(422).send(validation.error.details);
   }else{
    db.collection('list').insertOne(objPost);
    res.sendStatus(201);
   }
}

export async function deleteInfo(req, res){
    const {idInfo} = req.params;
    console.log(idInfo);
    try{
    const deleting = await db.collection('list').deleteOne({_id: new ObjectId (idInfo)});
    console.log(deleting)
    res.send(deleting);
    }catch(error){
        res.status(500).send(error);
    }
}