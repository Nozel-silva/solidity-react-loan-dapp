// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

contract Loans {

    event Applyforloan(address recipient, uint loanId);
    event DeleteLoan(uint loanId, bool isDeleted);
    event UpdateLoan(uint loanId, string status);

    address public owner;
    

    struct Loan {
        uint id;
        address borrower;
        string fullname;
        string location;
        uint amount;
        uint rate;
        uint year;
        uint interestperyear;
        uint totalpayment;
        uint monthlypayment;
        string status;
        bool isDeleted;
    }

    Loan[] private loans;

    mapping(uint256 => address) loantoBorrower;

    constructor () {
        owner = address(msg.sender);
    }

    function applyForLoan(string memory fullname, string memory location, uint amount, uint year) external {
        uint loanId = loans.length;
        uint rate = 4;

        // calculate simple interest for loan, make sure to avoid floats
        uint temp_interestperyear = (amount * rate) / 100;
        uint temp_totalpayment = (temp_interestperyear * year) + amount;
        uint temp_mnthlypayment = temp_totalpayment / (year * 12);

        loans.push(Loan(loanId, msg.sender, fullname, location, amount, rate, year, temp_interestperyear, temp_totalpayment, temp_mnthlypayment, "Pending", false));
        loantoBorrower[loanId] = msg.sender;
        emit Applyforloan(msg.sender, loanId);
    }

    function getMyLoans() external view returns (Loan[] memory) {
        Loan[] memory temporary = new Loan[](loans.length);
        uint counter = 0;
        for(uint i=0; i<loans.length; i++) {
            if(loantoBorrower[i] == msg.sender && loans[i].isDeleted == false) {
                temporary[counter] = loans[i];
                counter++;
            }
        }

        Loan[] memory result = new Loan[](counter);
        for(uint i=0; i<counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    function getAlLoans() external view onlyOwner returns (Loan[] memory) {
        Loan[] memory result = new Loan[](loans.length);
        for(uint i=0; i<loans.length; i++) {
            result[i] = loans[i];
        }
        return result;
    }

    function deleteLoan(uint loanId, bool isDeleted) external onlyOwner {
        loans[loanId].isDeleted = isDeleted;
        emit DeleteLoan(loanId, isDeleted);
    }

    function updateLoan(uint loanId, string memory status) external onlyOwner {
        loans[loanId].status = status;
        emit UpdateLoan(loanId, status);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorised");
        _;
    }

}