const nodemon = require('nodemon')

nodemon({
  script: './bin/mailq',
  verbose: true,
  watch: [
    'index.js',
    'lib/*'
  ],
  args: [
    '--verbose'
  ]
}).on('start', function () {
  console.log(`\n##########################`)
})
