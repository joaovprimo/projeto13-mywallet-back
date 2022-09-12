import express from "express";
import cors from 'cors';
import joi from 'joi';
import dayjs from  'dayjs';
import dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import {MongoClient} from 'mongodb';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect(()=>{
    db = mongoClient.db('wallet');
});

const singInSchema = joi.object({
    email: joi.string().required(),
    senha: joi.string().required()
});

const singUpSchema = joi.object({
    email: joi.string().required(),
    nome: joi.string().required(),
    senha:joi.string().required()
});

const postSchema = joi.object({
    idUser: joi.required(),
    description: joi.string().min(1).required(),
    type: joi.string().min(1).required(),
    value: joi.required(),
    day: joi.required(),
});



app.post('/singup', async(req,res)=>{
    const {email, senha, nome} = req.body;
    const validation = singUpSchema.validate({email, senha, nome}, {abortEarly: false});
    
    if(validation.error){
        return res.status(422).send('algo de errado no validation 1');
    }
     const hashPassword = bcrypt.hashSync(senha,13);

     try{
        const user = await db.collection('users').findOne({email});
        if(!user){
           db.collection('users').insertOne({
                nome,
                email,
                senha: hashPassword
        })
        }
        else{
            res.status(409).send("Email já cadastrado em outra conta")
        }
    }
     catch(error){
        console.log(error);
      return res.sendStatus(error);
     }

     return res.sendStatus(201);     
});

app.post('/singin', async(req, res)=>{
    const {email, senha} = req.body;

    const validation = singInSchema.validate({email, senha}, {abortEarly: false});
    
    if(validation.error){
        return res.status(422).send('algo de errado no validation 2');
    }

try{
    const user = await db.collection('users').findOne({email});
    console.log(user);
    const password = user ? bcrypt.compareSync(senha, user.senha): false;
    if(user && password){
        db.collection('sessions').deleteMany({
            userID: user._id
           }) 
        const token = uuid();
        db.collection('sessions').insertOne({
         token,
         userID: user._id
        }) 
        return res.send({nome:user.nome,token});
    }else{     
        return res.sendStatus(401);
    }}
    catch(error){
        console.log(error);
      return res.sendStatus(error);

    }
});


app.get('/list', async (req,res)=>{
    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer ', "");

    if(!token){
        res.status(401).send("erro1");
    }

    const session = await db.collection('sessions').findOne({token});

    if(!session){
        res.status(401).send("erro2");
    }
    const user = await db.collection('users').findOne({
        _id: session.userID
    })
    if(user){
        delete user.senha;
    let posts = await db.collection('list').find({idUser: user._id}).toArray();
            res.send(posts)
    }else{
        res.status(401).send("erro3");
    }
});

app.post('/list', async(req,res)=>{
    const {value, type, description} = req.body;
    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer ', "");
   console.log(value,type, description, token);

   try{
   const session = await db.collection('sessions').findOne({token});

   if(!session){
       res.status(401).send("erro2");
   }
   const user = await db.collection('users').findOne({
       _id: session.userID
   })

   const day = dayjs().format('DD/MM');

const objPost = {
    value,
    description,
    type,
    day,
    idUser: user._id
   };
console.log(objPost)
   const validation = postSchema.validate(objPost);
   if(validation.error){
    res.status(422).send(validation.error.details);
   }else{
    db.collection('list').insertOne(objPost);
    res.sendStatus(201);
   }
   }catch{
    res.status(401).send("erro3");
   }
})



app.listen(5000, ()=>{
    console.log('listening 5000');
})