
const express = require('express');
const controller = require('./user.controller');

const router = express.Router();

router.get('/me', controller.me);

module.exports = router;
