#!/usr/bin/env node

import { program } from 'commander'
import e from 'enquirer'
import degit from 'degit'
import chalk from 'chalk'
import { readFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'

const pkg = JSON.parse(readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), 'package.json')).toString())

// colored icons
const info = chalk.blue('ℹ')
const error = chalk.red('✖')
// const success = chalk.green('✔')

// available options
const frontends = ['react']
const backends = ['cfw']
const looks = ['plain']

// available projects
// TODO: maybe subdirectories would be better?
const projects = {
  cfw: {
    react: {
      plain: 'slimplate/slimplate-tpl-cf-react'
    }
  }
}

const showOptions = o => o.map(i => `"${o}"`).join(', ')

let options = {
  ...program
    .name('slimplate')
    .description('Initialize a new simplate project')
    .version(pkg.version, '-v, --version', 'Output the current version')
    .showSuggestionAfterError()
    .argument('[name]', 'Name of project to initialize')
    .option('-f, --frontend <frontend>', `Use a particular frontend framework. Options: ${showOptions(frontends)}`, frontends[0])
    .option('-b, --backend <backend>', `Use a particular backend. Options: ${showOptions(backends)}`, backends[0])
    .option('-l, --look <look>', `Use a particular widget toolkit. Options: ${showOptions(looks)}`, looks[0])
    .option('-i, --install', 'Run npm install', false)
    .parse()
    .opts(),
  name: program.args[0]
}

const questions = [
  {
    type: 'input',
    name: 'name',
    message: 'What is your project name?',
    initial: options.name || 'my-project',
    required: true
  },
  {
    type: 'select',
    name: 'frontend',
    message: 'What frontend library do you want to use?',
    choices: frontends,
    initial: options.frontend || frontends[0]
  },
  {
    type: 'select',
    name: 'backend',
    message: 'What backend library do you want to use?',
    choices: backends,
    initial: options.backend || backends[0]
  },
  {
    type: 'select',
    name: 'look',
    message: 'What look do you want to use?',
    choices: looks,
    initial: options.look || looks[0]
  },
  {
    type: 'confirm',
    name: 'install',
    message: 'Do you want to run npm install?',
    initial: options.install
  }
]

async function main () {
  if (!options.name) {
    console.log(info, 'We currently have only a few template-projects,')
    console.log(info, 'so the list of options are pretty limited.\n')
    console.log(info, 'Check back here for more, soon!')

    const answers = await e.prompt(questions)
    options = { ...options, ...answers }
    console.log(`
${info} You can create a project like this in the future, faster with this:
slimplate --name=${JSON.stringify(options.name)} --frontend=${options.frontend} --backend=${options.backend} --look=${options.look}
`)
  }
  options.project = projects[options.backend][options.frontend][options.look]

  // all combinations should be accounted for
  if (!options.project) {
    console.error(error, "Sorry, we haven't mad ethat template project, yet.")
    process.exit(1)
  }

  const emitter = degit(options.project, {
    cache: true,
    force: true,
    verbose: true
  })
  emitter.on('info', m => console.log(info, m.message))
  emitter.on('error', m => console.log(error, m.message))
  await emitter.clone(options.name)

  if (options.install) {
    process.chdir(options.name)
    exec('npm install', (error, stdout, stderr) => {
      if (stdout) {
        console.log(stdout.trim().split('\n').map(m => console.log(info, m)).filter(l => l).join('\n'))
      }
      if (stderr) {
        console.log(stdout.trim().split('\n').map(m => console.log(error, m)).filter(l => l).join('\n'))
      }
      if (error !== null) {
        console.log(error, 'Install Error: ' + error)
      }
    })
  }
}

main()
