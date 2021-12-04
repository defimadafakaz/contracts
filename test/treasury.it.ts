import {deployContract} from "../scripts/deploy";
import {MEMOries, StakingHelper, TimeERC20Token, TimeStaking, TimeTreasury, AnyswapV5ERC20} from "../typechain";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ethers} from "hardhat";
import {fromWei, toWei} from "./utils/wei-utils";

jest.setTimeout(120 * 1000);

let testAccount: SignerWithAddress;
let recepientAccount: SignerWithAddress;

beforeAll(async () => {
    [testAccount, recepientAccount] = await ethers.getSigners();
})

test.only("should deploy treasury", async () => {
    const mimContract = await deployContract<TimeERC20Token>("TimeERC20Token");
    const timeContract = await deployContract<TimeERC20Token>("TimeERC20Token");
    await timeContract.setVault(testAccount.address);
    await timeContract.mint(testAccount.address, toWei(500));

    const memoContract = await deployContract<MEMOries>("MEMOries");

    const treasuryContract = await deployContract<TimeTreasury>("TimeTreasury", timeContract.address, mimContract.address, 0, 0);
    await timeContract.setVault(treasuryContract.address);

    const timeStakingContract = await deployContract<TimeStaking>("TimeStaking", timeContract.address, memoContract.address, 3600, 0, 0);

    const stakingHelper = await deployContract<StakingHelper>("StakingHelper", timeStakingContract.address, timeContract.address)
    await timeContract.approve(stakingHelper.address, toWei(100000))

    //TODO: get staking to work
    await stakingHelper.stake(toWei(100), testAccount.address);


    const memoBalance = await memoContract.balanceOf(testAccount.address);
    expect(fromWei(memoBalance)).toEqual(100);

})