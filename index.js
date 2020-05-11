#!/usr/bin/env node

const yargs = require('yargs')
const prompts = require('prompts')
const debug = require('debug')

const client = require('./client')
const { createStories, generatePreviewHeadHtml } = require('./create')
const { writeToFile } = require('./utils')

// eslint-disable-next-line no-unused-expressions
yargs
    .command('init', 'Generate the config file', async () => {
        const log = debug('acme:init')
        const questions = [
            {
                type: 'text',
                name: 'username',
                message: 'What is your AEM username?',
                initial: 'admin'
            },
            {
                type: 'text',
                name: 'password',
                message: 'What is your AEM password?',
                initial: 'admin'
            },
            {
                type: 'text',
                name: 'baseURL',
                message: 'What is the base URL of your AEM instance?',
                initial: 'http://localhost:4502'
            },
            {
                type: 'text',
                name: 'storybookContentPath',
                message:
                    'What is the content path to the Storybook sample content?',
                initial: '/content/<my-site>/storybook-sample-content'
            },
            {
                type: 'text',
                name: 'componentsContainer',
                message:
                    'What is the JCR path to the component variations on each page?',
                initial: 'jcr:content/root/container'
            },
            {
                type: 'text',
                name: 'policyPath',
                message: 'What is the path to the component policies?',
                initial:
                    '/conf/<my-site>/settings/wcm/policies/<my-site>/components'
            }
        ]
        const response = await prompts(questions)
        writeToFile('acme.settings.json', JSON.stringify(response, null, 4))
        log('Generated "acme.settings.json"')
    })
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
            client.getResources()
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
            generatePreviewHeadHtml(argv.source)
        }
    )
    .usage('Usage: $0 <command> <options>')
    .demandCommand(1, 'You need at least one command before moving on').argv
