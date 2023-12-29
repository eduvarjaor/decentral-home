// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PropertyRent {
    address payable public owner;
    uint256 public rentValue;

    event RentPaid(address tenant, uint256 amout);

    constructor(uint256 _rentValue) {
        owner = payable(msg.sender);
        rentValue = _rentValue;
    }

    function rent() public payable {
        require(msg.value == rentValue, "Rent value is incorrect.");
        owner.transfer(msg.value);
        emit RentPaid(msg.sender, msg.value);
    }
}
