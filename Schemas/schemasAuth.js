import joi from 'joi';

export const singInSchema = joi.object({
    email: joi.string().required(),
    senha: joi.string().required()
});

export const singUpSchema = joi.object({
    email: joi.string().required(),
    nome: joi.string().required(),
    senha:joi.string().required()
});
