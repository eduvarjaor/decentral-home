// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PropertyRent {
    address payable public owner;
    uint256 public rentValue;
    uint256[] private propertyIds;

    struct Property {
        uint256 id;
        string title;
        string description;
        bool isRented;
        address tenant;
        uint256 rentDeposit;
        uint256 rentStartTime;
        uint256 rentEndTime;
    }

    mapping(uint256 => Property) public properties;

    event RentPaid(address tenant, uint256 amount);
    event RentCancelled(address tenant, uint256 refundAmount);
    event RentReleased(address owner, uint256 amount);

    constructor(uint256 _rentValue) {
        owner = payable(msg.sender);
        rentValue = _rentValue;

        initializeProperties();
    }

    function addProperty(
        uint256 _id,
        string memory _title,
        string memory _description
    ) public {
        properties[_id] = Property({
            id: _id,
            title: _title,
            description: _description,
            isRented: false,
            tenant: address(0),
            rentDeposit: 0,
            rentStartTime: 0,
            rentEndTime: 0
        });

        propertyIds.push(_id);
    }

    function getProperties() public view returns (Property[] memory) {
        Property[] memory props = new Property[](propertyIds.length);
        for (uint i = 0; i < propertyIds.length; i++) {
            props[i] = properties[propertyIds[i]];
        }
        return props;
    }

    function initializeProperties() public {
        addProperty(
            0,
            "Panoramic City Views",
            "Airy 2-bedroom with ample natural light, in the city center."
        );
        addProperty(
            1,
            "Minimalist Urban Space",
            "Sleek 2-bedroom with modern design and integrated kitchen."
        );
        addProperty(
            2,
            "Luxury Urban Living",
            "2-bedroom combining luxury with a high-standard urban lifestyle."
        );
        addProperty(
            3,
            "Charming and Modern",
            "Cozy 2-bedroom with stylish wood accents and a homely feel."
        );
        addProperty(
            4,
            "Seaside Serenity",
            "Modern 1-bedroom with stunning ocean views and chic decor."
        );
        addProperty(
            5,
            "Cozy Retreat with Sauna",
            "Comfortable 1-bedroom with a private sauna and picturesque balcony."
        );
    }

    function rent(
        uint256 propertyId,
        uint256 _rentStartTime,
        uint256 _rentEndTime
    ) public payable {
        require(msg.value == rentValue, "Rent value is incorrect.");
        require(
            !properties[propertyId].isRented,
            "Property is already rented."
        );

        properties[propertyId].tenant = msg.sender;
        properties[propertyId].isRented = true;
        properties[propertyId].rentDeposit = msg.value;
        properties[propertyId].rentStartTime = _rentStartTime;
        properties[propertyId].rentEndTime = _rentEndTime;

        emit RentPaid(msg.sender, msg.value);
    }

    function resetRentState(uint256 propertyId) public {
        Property storage property = properties[propertyId];

        property.tenant = address(0);
        property.isRented = false;
        property.rentDeposit = 0;
        property.rentStartTime = 0;
        property.rentEndTime = 0;
    }

    function cancelRent(uint256 propertyId) public {
        Property storage property = properties[propertyId];
        require(
            msg.sender == property.tenant,
            "Only the tenant can cancel the rent."
        );
        require(property.isRented, "Property is not rented.");

        uint256 refundAmount = property.rentDeposit / 2;
        payable(property.tenant).transfer(refundAmount);
        payable(owner).transfer(property.rentDeposit - refundAmount);

        resetRentState(propertyId);
        emit RentCancelled(property.tenant, refundAmount);
    }

    function releaseRentToOwner(uint256 propertyId) private {
        Property storage property = properties[propertyId];

        uint256 amountToOwner = (property.rentDeposit * 90) / 100;
        payable(owner).transfer(amountToOwner);

        resetRentState(propertyId);
        emit RentReleased(owner, amountToOwner);
    }

    function endRent(uint256 propertyId) public {
        releaseRentToOwner(propertyId);
        resetRentState(propertyId);
    }
}
