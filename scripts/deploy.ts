import {ethers} from "hardhat";
import {Contract} from "hardhat/internal/hardhat-network/stack-traces/model";

export const allContractNames = [
    "contracts/BondDepository.sol:TimeBondDepository",
    "MEMOries",
    "Migrations",
    "TimeStaking",
    "contracts/StakingDistributor.sol:Distributor",
    "StakingHelper",
    "StakingWarmup",
    "TimeBondingCalculator",
    "TimeERC20Token",
    "TimeTreasury",
    "wMEMO"
]

export async function deployContract<T = Contract>(contractName: string, ...args: any): Promise<T> {
    const contractFactory = await ethers.getContractFactory(contractName);
    const contractInstance = await contractFactory.deploy(...args);
    await contractInstance.deployed();
    console.log(`${contractName} deployed to: ${contractInstance.address}`)

    return contractInstance as any;
}

async function main() {
    // await hre.run('compile');

    // await deployContract("contracts/BondDepository.sol:TimeBondDepository")
    // await deployContract("MEMOries")
}

(async () => {
    await main().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
})()