#!/usr/bin/env node

const chalk = require('chalk')

const currentNodeVersion = process.versions.node
const major = currentNodeVersion.split('.')[0]

if (major < 8) {
  console.error(
    chalk.red(
      'You are running Node ' + currentNodeVersion
      + '.\n' + 'jeem-cli requires Node 8 or higher. \n'
      + 'Please update your version of Node'
    )
  )
  process.exit(1)
}

require('./createApp')