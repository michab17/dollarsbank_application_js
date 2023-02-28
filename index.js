#!/usr/bin/env node
import chalk from 'chalk';
import boxen from 'boxen';
import inquirer from 'inquirer';
import ora from 'ora';
import Account from './src/account.js';

const greeting = chalk.white.bold("Hello!");
console.log(greeting)

let testName;

const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms))

// const boxenOptions = {
//  padding: 1,
//  margin: 1,
//  borderStyle: "round",
//  borderColor: "green",
//  backgroundColor: "#555555"
// };
// const msgBox = boxen( greeting, boxenOptions );

async function getName() {
    const answer = await inquirer.prompt({
        name: "name",
        type: "input",
        message: "Please enter your name!"
    })

    testName = answer.name;
}

async function question() {
    const answers = await inquirer.prompt({
        name: 'question',
        type: 'list',
        message: 'When was JavaScript created?',
        choices : [
            'May 23rd, 1995',
            'Nov 24th, 1995',
            'Dec 4th, 1995',
            'Dec 17th, 1996',
        ]
    })
    return handleAnswer('Dec 4th, 1995', answers.question)
}

async function handleAnswer(correctAnswer, givenAnswer) {
    const spinner = ora('Checking answer...').start();

    await sleep()

    if (correctAnswer === givenAnswer) {
        spinner.succeed(`Correct answer, nice work ${testName}!`)
    } else {
        spinner.fail(`Invalid answer, better luck next time ${testName}!`)
        process.exit(1)
    }
}

// await getName();

// console.log(greeting, (testName))

// await question();

const acc1 = new Account("account one", "address", "(111) 111-1111", "acc1", "password", 1000.00);

console.log(acc1.availableFunds)