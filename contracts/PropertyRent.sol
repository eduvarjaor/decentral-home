// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PropertyRent {
    address payable public owner;
    uint256 public rentValue;
    address public tenant;
    bool public isRented;
    uint256 public rentDeposit;
    uint256 public rentStartTime;
    uint256 public rentEndTime;

    event RentPaid(address tenant, uint256 amount);
    event RentCancelled(address tenant, uint256 refundAmount);
    event RentReleased(address owner, uint256 amount);

    constructor(uint256 _rentValue) {
        owner = payable(msg.sender);
        rentValue = _rentValue;
    }

    function rent(uint256 _rentDuration) public payable {
        require(msg.value == rentValue, "Rent value is incorrect.");
        require(!isRented, "Property is already rented.");
        require(_rentDuration > 0, "Rent duration must be in the future.");

        tenant = msg.sender;
        isRented = true;
        rentDeposit = msg.value;
        rentStartTime = block.timestamp;
        rentEndTime = rentStartTime + _rentDuration;

        emit RentPaid(msg.sender, msg.value);
    }
}
