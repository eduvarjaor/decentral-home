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

    function resetRentState() private {
        tenant = address(0);
        isRented = false;
        rentDeposit = 0;
    }

    function cancelRent() public {
        require(msg.sender == tenant, "Only the tenant can cancel the rent.");
        require(isRented, "Property is not rented.");

        uint256 refundAmount = rentDeposit / 2;
        payable(tenant).transfer(refundAmount);
        payable(owner).transfer(rentDeposit - refundAmount);

        resetRentState();
        emit RentCancelled(tenant, refundAmount);
    }

    function releaseRentToOwner() public {
        require(msg.sender == owner, "Only the owner can release the rent.");
        require(isRented, "Property is not rented.");

        uint256 amount = rentDeposit;
        payable(owner).transfer(amount);

        resetRentState();
        emit RentReleased(owner, amount);
    }
}
