const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const User = require("../models/Users");

router.post("/register", async(req,res)=>{
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const confirmpassword = req.body.confirmpassword

    if(name == null || email == null || password == null || confirmpassword == null){
        return res.status(400).json({error : "Por favor, preencha todos os campos"});
    }

    else if(password != confirmpassword){
        return res.status(400).json({error: "as senhas não conferem"})
    }

    const emailExist = await User.findOne({email : email})
    if(emailExist){
        return res.status(400).json({error : "O e-mail informado já existe."})
    }

    //criando Hash de Senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt)

    //criando usuario
    const user = new User({
        name : name,
        email : email,
        password : passwordHash
    })
//montando um try catch para pega outros erros e afins
try {
    const newUser = await user.save();
    //criando o token do usuario
    const token = jwt.sign(
    {
    name : newUser.name,
    id : newUser._id
    },
    "segredo" //isso tonar o nosso token único
    );
    //retornar o token para o projeto e manda mensagem
    res.json({error: null, msg: "Você fez o cadastro com sucesso!!!", token: token, userId:
    newUser._id});
    } catch(error){
    res.status(400).json({error});
    }
});

router.post("/login", async(req,res)=>{
    const email = req.body.email
    const password = req.body.password

    const emailExist = await User.findOne({email : email})
    if(!emailExist){
        return res.status(400).json({error : "O e-mail informado não existe."})
    }
    const checkPassword = await bcrypt.compare(password, emailExist.password)
    if(!checkPassword){
        return res.status(400).json({error : "senha invalida"}) 
    }

    //usuario cadastrado
    const token = jwt.sign({
        name : emailExist.name,
        id : emailExist._id
        },
        "segredo"
        );
        //retornando o token e mensagem de autorização
        res.json({error : null, msg : "Você esta logado!!!", token: token, userId: emailExist._id})
});

module.exports = router;