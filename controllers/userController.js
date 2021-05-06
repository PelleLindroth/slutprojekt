const User = require('../models/userModel')

const authenticate = async (req, res, next) => {
    try{
        const user = await User.authenticate(req.body)
        res.json(user)
    }catch(error){
        console.log(error.errorMessage)
        next(error)
    }
}

module.exports = {
    authenticate
}