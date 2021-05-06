const express = require('express')
const userRoutes = express.Router()
const userController = require('../controllers/userController')
const authToken = require('../middleware/authToken')
const User = require('../models/userModel')
const {Unauthorized} = require('../errors/index')


userRoutes.get('/users', authToken, async (req, res, next) => {
    try{
        console.log(req.user);
        // throw new Unauthorized()
        const users = await User.findAll()
        res.json({ users })
    }catch(error){
        next(error)
    }
  
})

userRoutes.post('/authenticate', userController.authenticate)

module.exports = userRoutes