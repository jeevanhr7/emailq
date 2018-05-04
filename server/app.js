Object.unflatten = function (data) {
  'use strict'
  if (Object(data) !== data || Array.isArray(data)) {
    return data
  }
  // eslint-disable-next-line no-useless-escape
  const regex = /\.?([^.\[\]]+)|\[(\d+)\]/g
  const resultholder = {}
  for (const p in data) {
    let cur = resultholder
    let prop = ''
    let m
    // eslint-disable-next-line no-cond-assign
    while (m = regex.exec(p)) {
      cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}))
      prop = m[2] || m[1]
    }
    cur[prop] = data[p]
  }
  return resultholder[''] || resultholder
}

Object.flatten = function (data) {
  var result = {}

  function recurse (cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++) { recurse(cur[i], prop + '[' + i + ']') }
      if (l === 0) { result[prop] = [] }
    } else {
      var isEmpty = true
      for (var p in cur) {
        isEmpty = false
        recurse(cur[p], prop ? prop + '.' + p : p)
      }
      if (isEmpty && prop) { result[prop] = {} }
    }
  }

  recurse(data, '')
  return result
}

const http = require('http')
const express = require('express')

const config = require('./config/environment')

const app = express()

require('./config/express')(app)

const {
  host,
  port
} = {
  host: '0.0.0.0',
  port: 1587
}

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
})

process.on('uncaughtException', (err) => {
  console.log('uncaughtException', err)
})

const server = http.createServer(app)

if (config.env !== 'test') {
  server.listen(port, host, () => {
    console.log(`\n######################################################`)
    console.log(`## EmailQ: Amazon SES Compatible                    ##`)
    console.log(`######################################################\n##`)
    console.log(`## AWSAccessKeyId: ${config.AWSAccessKeyId}`)
    console.log(`## AWSSecretKey: ${config.AWSSecretKey}`)
    console.log(`## AWSSecretKey: ${config.AWSRegion}`)
    console.log(`## AWSEndPoint: ${config.AWSEndPoint || `http://${host}:${port}`}`)
    console.log('## Update SMTP settings in `~/.emailq` and restart server')
    console.log('## To start demo email server `npm i -g maildev && maildev`')
    console.log(`##\n#######################################################\n`)
  })
}

module.exports = app
