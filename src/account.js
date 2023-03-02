class Account {
    constructor(username, address, phoneNumber, userId, pin, availableFunds, transactions) {
        this.username = username;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.userId = userId;
        this.pin = pin;
        this.availableFunds = availableFunds;
        this.transactions = transactions;
    }

    toString() {
		return "Name: " + this.username + "\nAddress: " + this.address + "\nPhone Number: " + this.phoneNumber + "\nUser Id: "
				+ this.userId + "\nPIN: " + this.pin + "\nAvailable Funds: " + this.availableFunds;
	}
}

export default Account;