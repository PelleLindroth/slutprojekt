const express = require('express')
const userRoutes = express.Router()
const User = require('../models/userModel')

// userRoutes.get('/users', async (req, res) => {
//   const users = await User.findAll()
//   res.json({ users })
// })

module.exports = userRoutes