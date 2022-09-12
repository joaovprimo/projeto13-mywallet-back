import bcrypt from 'bcrypt';
import db from '../db/db.js'
import { v4 as uuid} from 'uuid';

export async function singup(req,res){
    const {email, senha, nome} = req.body;

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
}

export async function singin(req,res){
    const {email, senha} = req.body;

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
}