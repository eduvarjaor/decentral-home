const PropertyRent = artifacts.require("PropertyRent");

contract("PropertyRent", function (accounts) {
    let rentContract;
    const rentValue = web3.utils.toWei("1", "ether");
    const rentDuration = 60 * 60 * 24;
    const owner = accounts[0];
    const tenant = accounts[1];

    beforeEach(async () => {
        rentContract = await PropertyRent.new(rentValue);

        await rentContract.rent(rentDuration, {
            from: tenant,
            value: rentValue,
        });
    });

    it("should deploy correctly with the correct rent value", async () => {
        assert.equal(
            await rentContract.rentValue(),
            rentValue,
            "Rent value is incorrect."
        );
    });

    it("should allow a tenant to pay a rent", async () => {
        assert.equal(
            await rentContract.isRented(),
            true,
            "Property should be rented."
        );
        assert.equal(
            await rentContract.tenant(),
            tenant,
            "Tenant should be set correctly."
        );
    });

    it("should allow the tenant to cancel the rent", async () => {
        const initialTenantBalance = await web3.eth.getBalance(tenant);
        await rentContract.cancelRent({ from: tenant });
        const newTenantBalance = await web3.eth.getBalance(tenant);

        assert.isAbove(
            Number(newTenantBalance),
            Number(initialTenantBalance),
            "Tenant should receive a refund."
        );
        assert.equal(
            await rentContract.isRented(),
            false,
            "Property should not be rented after cancellation."
        );
    });

    it("should prevent renting if already rented", async () => {
        const secondTenant = accounts[2];
        try {
            await rentContract.rent(rentDuration, {
                from: secondTenant,
                value: rentValue,
            });
            assert.fail("Should not allow renting if already rented");
        } catch (error) {
            assert.include(
                error.message,
                "Property is already rented",
                "Error should contain 'Property is already rented'"
            );
        }
    });

    it("should allow owner to release rent", async () => {
        await rentContract.releaseRentToOwner({ from: owner });

        await rentContract.rent(rentDuration, {
            from: tenant,
            value: rentValue,
        });

        const initialOwnerBalance = BigInt(await web3.eth.getBalance(owner));
        await rentContract.releaseRentToOwner({ from: owner });

        const newOwnerBalance = BigInt(await web3.eth.getBalance(owner));
        assert(
            newOwnerBalance > initialOwnerBalance,
            "Owner should have received the rent"
        );

        const state = await rentContract.isRented();
        assert.equal(state, false, "Rent state should be reset to false");
    });

    it("should prevent non-tenant from canceling the rent", async () => {
        const nonTenant = accounts[2];
        try {
            await rentContract.cancelRent({ from: nonTenant });
            assert.fail("Should not allow non-tenant to cancel the rent");
        } catch (error) {
            assert.include(
                error.message,
                "Only the tenant can cancel the rent",
                "Error should contain 'Only the tenant can cancel the rent'"
            );
        }
    });

    it("should prevent non-owner from releasing the rent", async () => {
        const nonOwner = accounts[2];
        try {
            await rentContract.releaseRentToOwner({ from: nonOwner });
            assert.fail("Should not allow non-owner to release the rent");
        } catch (error) {
            assert.include(
                error.message,
                "Only the owner can release the rent",
                "Error should contain 'Only the owner can release the rent'"
            );
        }
    });
});
