const PropertyRent = artifacts.require("PropertyRent");

contract("PropertyRent", function (accounts) {
    let rentContract;
    const rentValue = web3.utils.toWei("1", "ether");

    beforeEach(async () => {
        rentContract = await PropertyRent.new(rentValue);
    });

    it("should deploy correctly with the correct rent value", async () => {
        assert.equal(
            await rentContract.rentValue(),
            rentValue,
            "Rent value is incorrect."
        );
    });

    it("should allow a tenant to pay a rent", async () => {
        const tenant = accounts[1];
        const initialOwnerBalance = await web3.eth.getBalance(
            await rentContract.owner()
        );
        await rentContract.rent({ from: tenant, value: rentValue });
        const newOwnerBalance = await web3.eth.getBalance(
            await rentContract.owner()
        );
        assert.equal(
            newOwnerBalance,
            BigInt(initialOwnerBalance) + BigInt(rentValue),
            "Rent was not paid correctly."
        );
    });
});
