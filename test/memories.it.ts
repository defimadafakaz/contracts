import {deployContract} from "../scripts/deploy";
import Web3 from "web3";
import {fromWei} from "./utils/wei-utils";
import {MEMOries} from "../typechain";

jest.setTimeout(120 * 1000);

test("Should deploy Memories contract with total supply", async () => {
    const contract = await deployContract<MEMOries>("MEMOries")
    const signerAddress = await contract.signer.getAddress();
    const ownerBalance = await contract.balanceOf(signerAddress);

    expect(fromWei(ownerBalance)).toEqual("0")

    const totalSupply = await contract.totalSupply()

    expect(fromWei(totalSupply)).toEqual("5000000");
})