const PropertyRent = artifacts.require("PropertyRent");

module.exports = function (deployer) {
    const defaultRentValue = web3.utils.toWei("1", "ether");
    deployer.deploy(PropertyRent, defaultRentValue);
};
