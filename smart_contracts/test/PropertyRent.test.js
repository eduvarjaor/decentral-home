const PropertyRent = artifacts.require("PropertyRent");

contract("PropertyRent", function (accounts) {
    let rentContract;
    const rentValue = web3.utils.toWei("1", "ether");
    const rentDuration = 60 * 60 * 24;
    const owner = accounts[0];
    const tenant = accounts[1];
    const nonTenant = accounts[2];
    const propertyId = 0;

    beforeEach(async () => {
        rentContract = await PropertyRent.new(rentValue);
        await rentContract.addProperty(
            propertyId,
            "Test Property",
            "Description of Test Property"
        );
    });

    it("should deploy correctly with the correct rent value", async () => {
        assert.equal(
            await rentContract.rentValue(),
            rentValue,
            "Rent value is incorrect."
        );
    });

    it("should allow a tenant to pay rent", async () => {
        await rentContract.rent(propertyId, rentDuration, rentDuration + 1000, {
            from: tenant,
            value: rentValue,
        });

        let property = await rentContract.properties(propertyId);
        assert.equal(property.isRented, true, "Property should be rented.");
        assert.equal(
            property.tenant,
            tenant,
            "Tenant should be set correctly."
        );
    });

    it("should check initial property states", async () => {
        let property = await rentContract.properties(propertyId);
        assert.equal(
            property.title,
            "Test Property",
            "Property title is incorrect."
        );
        assert.equal(
            property.description,
            "Description of Test Property",
            "Property description is incorrect."
        );
        assert.equal(
            property.isRented,
            false,
            "Property should not be rented initially."
        );
    });

    it("should add a new property and verify it's added correctly", async () => {
        const newPropertyId = 1;
        await rentContract.addProperty(
            newPropertyId,
            "New Test Property",
            "Description of New Test Property"
        );

        let newProperty = await rentContract.properties(newPropertyId);
        assert.equal(
            newProperty.title,
            "New Test Property",
            "New property title is incorrect."
        );
        assert.equal(
            newProperty.description,
            "Description of New Test Property",
            "New property description is incorrect."
        );
    });

    it("should allow owner to end rent", async () => {
        await rentContract.rent(propertyId, rentDuration, rentDuration + 1000, {
            from: tenant,
            value: rentValue,
        });

        await rentContract.endRent(propertyId, { from: owner });

        let property = await rentContract.properties(propertyId);
        assert.equal(property.isRented, false, "Rent should be ended.");
    });

    it("should allow the tenant to cancel the rent", async () => {
        await rentContract.rent(propertyId, rentDuration, rentDuration + 1000, {
            from: tenant,
            value: rentValue,
        });

        const initialTenantBalance = BigInt(await web3.eth.getBalance(tenant));
        await rentContract.cancelRent(propertyId, { from: tenant });
        const newTenantBalance = BigInt(await web3.eth.getBalance(tenant));

        assert(
            newTenantBalance > initialTenantBalance,
            "Tenant should receive a refund."
        );
        let property = await rentContract.properties(propertyId);
        assert.equal(
            property.isRented,
            false,
            "Property should not be rented after cancellation."
        );
    });

    it("should prevent renting if already rented", async () => {
        await rentContract.rent(propertyId, rentDuration, rentDuration + 1000, {
            from: tenant,
            value: rentValue,
        });

        try {
            await rentContract.rent(
                propertyId,
                rentDuration,
                rentDuration + 1000,
                {
                    from: nonTenant,
                    value: rentValue,
                }
            );
            assert.fail("Should not allow renting if already rented");
        } catch (error) {
            assert.include(
                error.message,
                "Property is already rented",
                "Error should contain 'Property is already rented'"
            );
        }
    });

    it("should prevent non-tenant from canceling the rent", async () => {
        await rentContract.rent(propertyId, rentDuration, rentDuration + 1000, {
            from: tenant,
            value: rentValue,
        });

        try {
            await rentContract.cancelRent(propertyId, { from: nonTenant });
            assert.fail("Should not allow non-tenant to cancel the rent");
        } catch (error) {
            assert.include(
                error.message,
                "Only the tenant can cancel the rent",
                "Error should contain 'Only the tenant can cancel the rent'"
            );
        }
    });
});
