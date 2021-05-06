const db = require('./connection')

require('../models/userModel')
require('../models/taskModel')
require('../models/messageModel')

db.sync({ force: true })