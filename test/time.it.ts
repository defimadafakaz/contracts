import {deployContract} from "../scripts/deploy";
import {fromWei, toWei} from "./utils/to-wei";
import {TimeERC20Token} from "../typechain";

const testVaultAccount = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const testWalletAccount = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

test("should deploy time token with totalSupply of Zero", async () => {
    const timeContract = await deployContract<TimeERC20Token>("TimeERC20Token");
    const totalSupply = await timeContract.totalSupply();
    expect(fromWei(totalSupply)).toEqual("0");
})

test("Should set vault address", async function () {
    const timeContract = await deployContract<TimeERC20Token>("TimeERC20Token");
    await timeContract.setVault(testVaultAccount)
    const vault = await timeContract.vault();
    expect(vault).toEqual(testVaultAccount)
});

test("should mint 500 TIME tokens to address", async () => {
    const timeContract = await deployContract<TimeERC20Token>("TimeERC20Token");
    await timeContract.setVault(testVaultAccount)

    await timeContract.mint(testWalletAccount, toWei(500));
    const walletBalance = await timeContract.balanceOf(testWalletAccount)
    expect(fromWei(walletBalance)).toEqual("500");
})