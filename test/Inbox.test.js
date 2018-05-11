const assert = require('assert');
//ganache = local test network
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;

beforeEach(async () => {
    //Get a list of all accounts
    accounts = await web3.eth.getAccounts()

    // Use one account to deploy the contract
    // inbox represents contract on the blockchain, can interact with the blockchain through it
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        // arguments are for the constructor function
        .deploy({ data: bytecode, arguments: ['Hi There!'] })
        // who's deploying the contract and gasLimit
        .send({ gas: '1000000', from: accounts[0] });

    inbox.setProvider(provider);
})

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hi There!');
    })

    it('can change the message', async () => {
        // send args  - who is paying for this method
        await inbox.methods.setMessage('Bye').send({ from: accounts[0] });

        const message = await inbox.methods.message().call();
        assert.equal(message, 'Bye');

    })
});