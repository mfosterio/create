#!/usr/bin/env node

import e from 'enquirer'

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
];

let answers = await e.prompt(question)
console.log(answers)