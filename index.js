#!/usr/bin/env node

const yargs = require('yargs')
const client = require('./client')
const createStories = require('./create-stories')

// eslint-disable-next-line no-unused-expressions
yargs
    .command(
        'pull',
        'Pull content from AEM',
        (yargs) => {
            return yargs
                .option('destination', {
                    alias: 'd',
                    describe: 'Destination directory for AEM assets',
                    type: 'string',
                    default: 'aem-assets'
                })
                .config()
                .demandOption('config')
        },
        (argv) => {
            const username = argv.username || 'admin'
            const password = argv.password || 'admin'
            const credentials = username + ':' + password

            client.init({
                credentials: credentials,
                baseURL: argv.baseURL,
                storybookContentPath: argv.storybookContentPath,
                componentsContainer: argv.componentsContainer,
                assetsDir: argv.destination,
                policyPath: argv.policyPath
            })
            client.getAllComponents()
            client.getPolicies()
        }
    )
    .command(
        'create',
        'Create stories from AEM content',
        {
            source: {
                alias: 's',
                describe: 'Path to downloaded AEM assets',
                type: 'string',
                default: 'aem-assets'
            }
        },
        (argv) => {
            createStories(argv.source)
        }
    )
    .usage('Usage: $0 <command> <options>')
    .demandCommand(1, 'You need at least one command before moving on').argv
