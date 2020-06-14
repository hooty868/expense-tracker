const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const users = require('./modules/users')
const auth = require('./modules/auth')
const record = require('./modules/record')
const { authenticator } = require('../middleware/auth')

router.use('/users', users)
router.use('/auth', auth)
router.use('/', authenticator, home)
router.use('/record', authenticator, record)

module.exports = router