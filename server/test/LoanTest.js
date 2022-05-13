const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Loan Contract", function () {
    let Loans;
    let loanContract;
    let owner;
    let original = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;

    const NUM_TOTAL_LOANS = 5;

    let totalLoans;

    beforeEach(async function () {
        Loans = await ethers.getContractFactory("Loans");
        [owner] = await ethers.getSigners();
        loanContract = await Loans.deploy();

        totalLoans = [];

        for (let i = 0; i < NUM_TOTAL_LOANS; i++) {
            let loan = {
                'fullname': 'Loan number:- ' + i,
                'location': 'ng',
                'amount': 20000 + i,
                'year': 4 + i
            };

            await loanContract.applyForLoan(loan.fullname, loan.location, loan.amount, loan.year);
            totalLoans.push(loan);
        }
    });

    describe("Apply for loan", function () {
        it("should emit Applyforloan event", async function () {
            let loan = {
                'fullname': 'my name',
                'location': 'ng',
                'amount': 20000,
                'year': 4
            };

            await expect(await loanContract.applyForLoan(loan.fullname, loan.location, loan.amount, loan.year)
            ).to.emit(loanContract, 'Applyforloan').withArgs(owner.address, NUM_TOTAL_LOANS);
        })
    });
});