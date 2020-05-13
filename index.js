#!/usr/bin/env node

// To simplify paths in require(...) calls
const path = require('path')
require('app-module-path').addPath(path.join(__dirname, 'src'))

const yargs = require('yargs')

// eslint-disable-next-line no-unused-expressions
yargs
    .commandDir('src/commands')
    .usage('Usage: $0 <command> <options>')
    .demandCommand(1, 'You need at least one command before moving on').argv
