const joi = require("joi");

const signValidation = (req, res, next)=>{
    const schema = joi.object({
        name: joi.string().min(3).max(100).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).max(100).required()

    });
    const {error}= schema.validate(req.body);
    if(error){
        return res.status(400).json({massage : "bad request",error});
    }
    next();
}
const loginValidation = (req, res, next)=>{
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).max(100).required(),

    });
    const {error}= schema.validate(req.body);
    if(error){
        return res.status(400).json({massage : "bad request",error});
    }
    next();
}
module.exports = {
    signValidation, loginValidation
}