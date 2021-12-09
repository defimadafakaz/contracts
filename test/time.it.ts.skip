import {deployContract} from "../scripts/deploy";
import {fromWei, toWei} from "./utils/wei-utils";
import {TimeERC20Token} from "../typechain";
import {ethers} from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

jest.setTimeout(120 * 1000);

let testVaultAccount: SignerWithAddress;
let testWalletAccount: SignerWithAddress;

beforeAll(async () => {
    [testVaultAccount, testWalletAccount] = await ethers.getSigners();
})

test("should deploy time token with totalSupply of Zero", async () => {
    const timeContract = await deployContract<TimeERC20Token>("TimeERC20Token");
    const totalSupply = await timeContract.totalSupply();
    expect(fromWei(totalSupply)).toEqual("0");
})

test("Should set vault address", async function () {
    const timeContract = await deployContract<TimeERC20Token>("TimeERC20Token");
    await timeContract.setVault(testVaultAccount.address)
    const vault = await timeContract.vault();
    expect(vault).toEqual(testVaultAccount.address)
});

test("should mint 500 TIME tokens to address", async () => {
    const timeContract = await deployContract<TimeERC20Token>("TimeERC20Token");
    await timeContract.setVault(testVaultAccount.address)

    await timeContract.mint(testWalletAccount.address, toWei(500));
    const walletBalance = await timeContract.balanceOf(testWalletAccount.address)
    expect(fromWei(walletBalance)).toEqual("500");
})