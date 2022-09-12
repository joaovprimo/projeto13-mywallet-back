import { singInSchema, singUpSchema } from "../Schemas/schemasAuth.js";

export async function SingUpSchema(req,res,next){
    const {email, senha, nome} = req.body;
    const validation = singUpSchema.validate({email, senha, nome}, {abortEarly: false});
    
    if(validation.error){
        return res.status(422).send('algo de errado no validation 1');
    }
next();
} 

export async function SingInSechema (req, res, next){
    const {email, senha} = req.body;

    const validation = singInSchema.validate({email, senha}, {abortEarly: false});
    
    if(validation.error){
        return res.status(422).send('algo de errado no validation 2');
    }
    next();
}
