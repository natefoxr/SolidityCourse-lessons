const { getNamedAccounts, ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert } = require("chai");

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Tests", async function () {
          let fundMe;
          let deployer;
          const sendValue = ethers.utils.parseEthers("0.1");

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;
              fundMe = await ethers.getContract("FundMe", deployer);
          });

          it("allows people to fund and withdraw", async function () {
              const fundTxResponse = await fundMe.fund({ value: sendValue });
              await fundTxResponse.wait(1);
              const withdrawTxResponse = await fundMe.withdraw();
              await withdrawTxResponse.wait(1);

              const endingBalance = await fundMe.provider.getBalance(
                  fundMe.address
              );

              console.log(
                  endingBalance.toSting() +
                      " should equal 0, running assert equal..."
              );

              assert.equal(endingBalance.toString(), "0");
          });
      });
