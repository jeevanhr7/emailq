#!/usr/bin/env node

const path = require('path')
const fs = require('fs')

const index = path.join(path.dirname(fs.realpathSync(__filename)), '../server/index.js')
const MailQ = require(index)
