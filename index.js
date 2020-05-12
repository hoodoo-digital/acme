#!/usr/bin/env node

const yargs = require('yargs')

// eslint-disable-next-line no-unused-expressions
yargs
    .commandDir('commands')
    .usage('Usage: $0 <command> <options>')
    .demandCommand(1, 'You need at least one command before moving on').argv
