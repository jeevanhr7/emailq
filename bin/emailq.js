#!/usr/bin/env node

const path = require('path')
const fs = require('fs')

const index = path.join(path.dirname(fs.realpathSync(__filename)), '../server/index.js')
const MailQ = require(index)
const { exec } = require('child_process');
exec('sequelize db:migrate', (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }

  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
