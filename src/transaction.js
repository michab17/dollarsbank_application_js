import chalk from 'chalk';

class Transaction {
    constructor(type, description, timestamp) {
		this.type = type;
		this.description = description;
		this.timestamp = timestamp;
	}

    toString() {
        let transactionType;
        if (this.type === "Initial Deposit" || this.type === "Deposit" || this.type === "Incoming Transfer") {
            return chalk.greenBright.bold("Transaction type: " + this.type) + "\n Transaction description: " + this.description + "\n Time of transaction: " + this.timestamp;
        } else if (this.type === "Outgoing Transfer" || this.type === "Withdraw") {
            return chalk.red.bold("Transaction type: " + this.type) + "\n Transaction description: " + this.description + "\n Time of transaction: " + this.timestamp;
        }
	}
}

export default Transaction;