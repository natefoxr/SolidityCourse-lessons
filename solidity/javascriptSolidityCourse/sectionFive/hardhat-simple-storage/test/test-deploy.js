const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("SimpleStorage", function () {
    let simpleStorageFactory, simpleStorage;
    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
        simpleStorage = await simpleStorageFactory.deploy();
    });

    it("Should start with a favorite number of 0", async function () {
        const currentValue = await simpleStorage.retrieve();
        const expectedValue = "0";
        assert.equal(currentValue.toString(), expectedValue);
    });

    it("Should update when we call store", async function () {
        const expectedValue = "7";
        const transactionResponse = await simpleStorage.store(expectedValue);
        await transactionResponse.wait(1);

        const currentValue = await simpleStorage.retrieve();
        assert.equal(currentValue.toString(), expectedValue);
    });

    it("Should store a value when we call store", async function () {
        const currentValue = await simpleStorage.retrieve();
        const expectedValue = `${parseInt(currentValue) + 7}`;

        const transactionResponse = await simpleStorage.store(expectedValue);
        await transactionResponse.wait(1);

        const newValue = await simpleStorage.retrieve();
        assert.equal(newValue.toString(), expectedValue);
        assert.notEqual(newValue.toString(), currentValue);
    });

    it("Should retrieve a value", async function () {
        const currentValue = await simpleStorage.retrieve();
        assert.exists(currentValue);
    });

    it("Should add a person and favorite number", async function () {
        const newValue = "7";
        const newPerson = "Nate";
        const transactionResponse = await simpleStorage.addPerson(
            newPerson,
            newValue
        );
        await transactionResponse.wait(1);

        const currentPerson = await simpleStorage.people(0);
        assert.exists(currentPerson);
    });
});
