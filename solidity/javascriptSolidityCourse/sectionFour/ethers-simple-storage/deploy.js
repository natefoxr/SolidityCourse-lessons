const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.RPC_PROVIDER
    )
    let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    )

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    // console.log("\n\nDeploying, please wait...");

    const contract = await contractFactory.deploy()
    // console.log("\n\nHere is the deployment transaction: \n");
    // console.log(contract);

    await contract.deployTransaction.wait(1)
    // console.log("\n\nHere is the transaction receipt: \n");
    // console.log(deploymentReceipts);

    console.log(`Contract Address: ${contract.address}`)

    const currentFavoriteNumber = await contract.retrieve()
    console.log(
        `Current favorite number is ${currentFavoriteNumber.toString()}`
    )
    const transactionResponse = await contract.store("7")
    const transactionReceipt = await transactionResponse.wait(1)
    const updatedFavoriteNumber = await contract.retrieve()
    console.log(
        `Updated favorite number is ${updatedFavoriteNumber.toString()}`
    )
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
