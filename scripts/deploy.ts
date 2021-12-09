import {ethers} from "hardhat";
import {Contract} from "hardhat/internal/hardhat-network/stack-traces/model";
import {deployAll} from "./deployAll";

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
async function main() {
    // await hre.run('compile');
    await deployAll();
    // await deployContract("contracts/BondDepository.sol:TimeBondDepository")
    // await deployContract("MEMOries")
}

(async () => {
    await main().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
})()