const router = require('express').Router();
const User = require('../models/User');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const { registerValidation, loginValidation } = require('../lib/validation');


router.post('/register', async (req, res) => {

    const { error } = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const checkIfEmailExist = await User.findOne({email: req.body.email});
    if(checkIfEmailExist) return res.status(400).send('Email already exists');

    const checkIfNameExists = await User.findOne({name: req.body.name});
    if(checkIfNameExists) return res.status(400).send('Name already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send(savedUser)
    } catch(err){
        res.status(400).send(err)
    }
});


router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)


    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid Email or Password.')
  
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid Email or Password.')
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send('Login')
})



module.exports = router;