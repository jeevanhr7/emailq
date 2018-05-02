#!/usr/bin/env node

const path = require('path')
const fs = require('fs')

const index = path.join(path.dirname(fs.realpathSync(__filename)), '../server/index.js')

const { exec } = require('child_process');
exec('sequelize db:migrate');
const MailQ = require(index)
