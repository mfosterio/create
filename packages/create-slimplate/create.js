#!/usr/bin/env node

const e = require('enquirer')

const question = [
  {
    type: 'input',
    name: 'name',
    message: 'What is your name?'
  },
  {
    type: 'confirm',
    name: 'fishsticks',
    message: 'Do you like fish sticks?'
  }
]

async function main () {
  const answers = await e.prompt(question)
  console.log(answers)
}

main()
