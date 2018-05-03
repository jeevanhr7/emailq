const nodemon = require('nodemon')

nodemon({
  script: './bin/emailq',
  verbose: true,
  watch: [
    'index.js',
    'lib/*'
  ],
  args: [
    '--verbose'
  ]
}).on('start', function () {

})
