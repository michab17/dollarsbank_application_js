import chalk from 'chalk';
import boxen from 'boxen';
import inquirer from 'inquirer';
import ora from 'ora';
import Account from './src/account.js';
import Transaction from './src/transaction.js';

const vikramInitialDeposit = new Transaction("Initial Deposit", 'An initial deposit of $10000 was made when you created your account.', new Date())
const seanInitialDeposit = new Transaction("Initial Deposit", 'An initial deposit of $10000 was made when you created your account.', new Date())

const vikram = new Account('Vikram', 'usa', '(123) 456-7890', 'vikram', '1234', 10000.00, [vikramInitialDeposit]);
const sean = new Account('Sean', 'usa', '(123) 456-7890', 'sean', '1234', 10000.00, [seanInitialDeposit]);

const userList = [vikram, sean]

let activeAccount;

const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms))

const boxenOptions = {
 padding: 1,
 margin: 1,
 borderStyle: "round",
 borderColor: "green"
};

async function menu() {
    let greeting = chalk.yellowBright('DOLLARSBANK Welcomes You!!');
    
    console.log(boxen( greeting, boxenOptions ));

    const choice = await inquirer.prompt({
        name: 'menu_choice',
        type: 'list',
        message: chalk.magentaBright.bold('What would you like to do?'),
        choices : [
            '1. Create New Account',
            '2. Log In',
            '3. Exit'
        ]
    })
    
    if(choice.menu_choice === '1. Create New Account') {
        createAccount();
    } else if(choice.menu_choice === '2. Log In') {
        logIn();
    } else if(choice.menu_choice === '3. Exit') {
        console.log(chalk.yellowBright('Come back soon!'))
    }
}

async function createAccount() {
    let phoneBool = false;
    let validUserId = false;
    let validNumber = false;
    let userPhoneNumber;
    let userUserId;
    let userInitialDeposit;
    let userIdList = userList.map(user => user.userId)
    
    const greeting = chalk.yellowBright('Account Creation')

    console.log(boxen( greeting, boxenOptions ));

    console.log(chalk.greenBright('Please enter the following information:'))

    const name = await inquirer.prompt({
        name: 'name',
        type: 'input',
        message: chalk.magentaBright.bold('Customer Name:')
    })

    const address = await inquirer.prompt({
        name: 'address',
        type: 'input',
        message: chalk.magentaBright.bold('Address:')
    })

    while(!phoneBool) {
        const phoneNumber = await inquirer.prompt({
            name: 'phoneNumber',
            type: 'input',
            message: chalk.magentaBright.bold('Phone Number:')
        })
        
        let pattern = /^(()?\d{3}())?(-|\s)?\d{3}(-|\s)?\d{4}$/;
                
        if(pattern.test(phoneNumber.phoneNumber)) {
            userPhoneNumber = phoneNumber.phoneNumber
            phoneBool = true
        } else {
            console.log(chalk.redBright("Please enter ten digits for your phone number!"));
        }
    }

    while(!validUserId) {
        const userId = await inquirer.prompt({
            name: 'userId',
            type: 'input',
            message: chalk.magentaBright.bold('User Id:')
        })

        if(!userIdList.includes(userId.userId)) {
            userUserId = userId.userId
            validUserId = true
        } else {
            console.log(chalk.redBright("User Id is already taken, please enter a different User Id"));
        }
    }

    const pin = await inquirer.prompt({
        name: 'pin',
        type: 'input',
        message: chalk.magentaBright.bold('Pin:')
    })

    while(!validNumber) {
        const initialDeposit = await inquirer.prompt({
            name: 'initialDeposit',
            type: 'input',
            message: chalk.magentaBright.bold('Please enter the amount you would like to make for your initial deposit')
        })

        if(numberValidation(initialDeposit.initialDeposit)) {
            userInitialDeposit = initialDeposit.initialDeposit
            validNumber = true
        } else {
            console.log(chalk.redBright("Please enter a valid number"))
        }
    }

    const newAccount = new Account(name.name, address.address, userPhoneNumber, userUserId, pin.pin, userInitialDeposit, [])

    newAccount.transactions.push(new Transaction("Initial Deposit", `An initial deposit of $${userInitialDeposit} was made when you created your account.`, new Date()))

    userList.push(newAccount)

    const spinner = ora('Creating Account...').start();

    await sleep();

    spinner.succeed(`Account created successfully! Welcome ${newAccount.username}`)

    menu();
}

async function logIn() {
    const inputUserId = await inquirer.prompt({
        name: 'user_id',
        type: 'input',
        message: chalk.magentaBright.bold('Please enter your User ID')
    })
    const inputPin = await inquirer.prompt({
        name: 'pin',
        type: 'password',
        mask: '*',
        message: chalk.magentaBright.bold('Please enter your PIN')
    })

    let tempUser = getUser(inputUserId.user_id, inputPin.pin)

    if(tempUser === undefined) {
        console.log(chalk.redBright('User ID or PIN was invalid. Please try again.'))
        logIn()
    } else {
        activeAccount = tempUser

        const spinner = ora('Loggin In...').start();

        await sleep();

        spinner.succeed(`Log in successful! Welcome ${activeAccount.username}`)

        home()
    }
}

async function home() {
    const choice = await inquirer.prompt({
        name: 'choice',
        type: 'list',
        message: chalk.magentaBright.bold('What would you like to do?'),
        choices : [
            '1. Deposit',
            '2. Withdraw',
            '3. Transfer Funds',
            '4. View 5 Recent Transactions',
            '5. Display Your Information',
            '6. Sign Out'
        ]
    })

    if(choice.choice === '1. Deposit') {
        deposit();
    } else if(choice.choice === '2. Withdraw') {
        withdraw();
    } else if(choice.choice === '3. Transfer Funds') {
        transfer();
    } else if(choice.choice === '4. View 5 Recent Transactions') {
        viewTransactions();
    } else if(choice.choice === '5. Display Your Information') {
        display();
    } else if(choice.choice === '6. Sign Out') {
        menu();
    }
}

async function deposit() {
    const inputAmount = await inquirer.prompt({
        name: 'amount',
        type: 'input',
        message: chalk.magentaBright.bold('Please enter the amount of money you would like to deposit into your account')
    })

    if (numberValidation(inputAmount.amount) && parseFloat(inputAmount.amount) > 0) {
        activeAccount.availableFunds = parseFloat(activeAccount.availableFunds) + parseFloat(inputAmount.amount)
    
        const spinner = ora('Depositing funds...').start();
    
        await sleep();
    
        spinner.succeed(`Money deposited successfully! Your account now contains $${Number(activeAccount.availableFunds).toFixed(2)}`)

        activeAccount.transactions.unshift(new Transaction('Deposit', `$${parseFloat(inputAmount.amount)} was deposited into your account.`, new Date()))
    
        home()
    } else {
        console.log(chalk.redBright.bold('Please enter an amount of money greater than 0 and formatted: XX or XX.XX'))
        deposit()
    }
}

async function withdraw() {
    const inputAmount = await inquirer.prompt({
        name: 'amount',
        type: 'input',
        message: chalk.magentaBright.bold('Please enter the amount of money you would like to withdraw from your account')
    })

    if (numberValidation(inputAmount.amount) && parseFloat(inputAmount.amount) > 0) {
        activeAccount.availableFunds -= parseFloat(inputAmount.amount)
    
        const spinner = ora('Withdrawing funds...').start();
    
        await sleep();
    
        spinner.succeed(`Money withdrawn successfully! Your account now contains $${Number(activeAccount.availableFunds).toFixed(2)}`)

        activeAccount.transactions.unshift(new Transaction('Withdraw', `$${parseFloat(inputAmount.amount)} was withdrawn from your account.`, new Date()))
    
        home()
    } else {
        console.log(chalk.redBright.bold('Please enter an amount of money greater than 0 and formatted: XX or XX.XX'))
        withdraw()
    }
}

async function transfer() {
    const account = await inquirer.prompt({
        name: 'account',
        type: 'input',
        message: chalk.magentaBright.bold('Please enter the User ID of the account you wish to transfer to.')
    })

    let transferAccount = userList.find(user => user.userId === account.account)

    if (transferAccount === undefined) {
        console.log(chalk.redBright.bold('User with that User ID was not found. Please try again!'))
        transfer()
    } else {
        const inputAmount = await inquirer.prompt({
            name: 'amount',
            type: 'input',
            message: chalk.magentaBright.bold('Please enter the amount of money you would like to transfer from your account')
        })

        if (numberValidation(inputAmount.amount) && parseFloat(inputAmount.amount) > 0) {
            activeAccount.availableFunds -= parseFloat(inputAmount.amount)

            transferAccount.availableFunds += parseFloat(inputAmount.amount)
        
            const spinner = ora('Transfering funds...').start();
        
            await sleep();
        
            spinner.succeed(`Money transfered successfully! Your account now contains $${Number(activeAccount.availableFunds).toFixed(2)}`)
    
            activeAccount.transactions.unshift(new Transaction('Outgoing Transfer', `$${parseFloat(inputAmount.amount)} was transfered out of your account.`, new Date()))

            transferAccount.transactions.unshift(new Transaction('Incoming Transfer', `$${parseFloat(inputAmount.amount)} was transfered into your account.`, new Date()))
        
            home()
        } else {
            console.log(chalk.redBright.bold('Please enter an amount of money greater than 0 and formatted: XX or XX.XX'))
            withdraw()
        }
    }
}

function viewTransactions() {
    activeAccount.transactions = activeAccount.transactions.slice(0, 5)

    activeAccount.transactions.forEach(transaction => {
        console.log(chalk.whiteBright.bold(transaction.toString()))
    });
    home()
}

function display() {
    console.log(chalk.whiteBright(activeAccount.toString()))
    home()
}

function numberValidation(input) {
    if (isNaN(parseFloat(input))) {
        return false;
    } else {
        return true;
    }
}

function getUser(givenUserId, givenPin) {
    let user = userList.filter(user => user.userId === givenUserId && user.pin === givenPin).at(0)

    return user
}

function main() {
    menu();
}

main()