import Web3 from "web3";
import {Unit} from "web3-utils";

const web3 = new Web3();

export function fromWei(value: any, unit: Unit = "nanoether"): string {
    return web3.utils.fromWei(value.toString(), unit)
}

export function toWei(value: number, unit: Unit = "nanoether"): string {
    return web3.utils.toWei(`${value}`, unit);
}