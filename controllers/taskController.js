const { MissingCredentials, ResourceNotFound, Teapot, Forbidden } = require("../errors");
const { Op, where } = require("sequelize");
const User = require("../models/userModel");
const Task = require("../models/taskModel");
const Message = require("../models/messageModel");

const createTask = async(req, res, next) => {
    try {
        const {title, clientEmail} = req.body
        const workerId = req.user.id
        if (!title || !clientEmail) {
            throw new MissingCredentials(['title', 'clientEmail'])
        }
        const client = await User.findOne({where: {email: clientEmail}})
        if (!client) {
            throw new ResourceNotFound('Client')
        }
        const task = await Task.create({title, workerId, clientId:client.id})
        res.json(task)

    } catch (error) {
        next(error)
    }
}

module.exports = {
    createTask
}