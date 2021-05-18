const db = require('./connection')

require('../models/userModel')
require('../models/imageModel')
require('../models/taskModel')
require('../models/messageModel')
require('../models/reviewModel')
require('../models/errorReportModel')

db.sync({ force: true })