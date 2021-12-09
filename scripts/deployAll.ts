import {Contract} from "hardhat/internal/hardhat-network/stack-traces/model";

const { ethers } = require("hardhat");

export async function deployContract<T = Contract>(contractName: string, ...args: any): Promise<T> {
    const contractFactory = await ethers.getContractFactory(contractName);
    const contractInstance = await contractFactory.deploy(...args);
    await contractInstance.deployed();
    console.log(`${contractName} deployed to: ${contractInstance.address}`)

    return contractInstance as any;
}

export async function deployAll() {
    const [deployer, MockDAO] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    // Initial staking index
    const initialIndex = '7675210820';

    // First block epoch occurs
    const firstEpochBlock = '8961000';

    // What epoch will be first epoch
    const firstEpochNumber = '338';

    // How many blocks are in each epoch
    const epochLengthInBlocks = '2200';

    // Initial reward rate for epoch
    const initialRewardRate = '3000';

    // Ethereum 0 address, used when toggling changes in treasury
    const zeroAddress = '0x0000000000000000000000000000000000000000';

    // Large number for approval for MIM
    const largeApproval = '100000000000000000000000000000000';

    // Initial mint for MIM (20,000,000)
    const initialMint = '20000000000000000000000000';

    // MIM bond BCV
    const mimBondBCV = '257';

    // Bond vesting length in seconds. 3600 = 1 hour
    const bondVestingLength = '432000'; // 5 days

    // Min bond price
    const minBondPrice = '10';

    // Max bond payout
    const maxBondPayout = '75'

    // DAO fee for bond
    const bondFee = '500'; // 5%

    // Max debt bond can take on
    const maxBondDebt = '2000000000000000';

    // Initial Bond debt
    const intialBondDebt = '0'

    // Deploy Time
    const Time = await ethers.getContractFactory('TimeERC20Token');
    const time = await Time.deploy();

    // Deploy MIM
    const MIM = await ethers.getContractFactory('MagicInternetMoney');
    const mim = await MIM.deploy();

    // Deploy 10,000,000 mock MIM
    await mim.mint(deployer.address, initialMint);

    // Deploy treasury
    //@dev changed function in treaury from 'valueOf' to 'valueOfToken'... solidity function was coflicting w js object property name
    const Treasury = await ethers.getContractFactory('TimeTreasury');
    const treasury = await Treasury.deploy(time.address, mim.address, 0);

    // Deploy bonding calc
    const TimeBondingCalculator = await ethers.getContractFactory('TimeBondingCalculator');
    const timeBondingCalculator = await TimeBondingCalculator.deploy(time.address);

    // Deploy staking distributor
    const Distributor = await ethers.getContractFactory('Distributor');
    const distributor = await Distributor.deploy(treasury.address, time.address, epochLengthInBlocks, firstEpochBlock);

    // Deploy Memories
    const Memories = await ethers.getContractFactory('MEMOries');
    const memo = await Memories.deploy();

    // Deploy Staking
    const Staking = await ethers.getContractFactory('TimeStaking');
    const staking = await Staking.deploy(time.address, memo.address, epochLengthInBlocks, firstEpochNumber, firstEpochBlock);

    // Deploy staking warmup
    const StakingWarmpup = await ethers.getContractFactory('StakingWarmup');
    const stakingWarmup = await StakingWarmpup.deploy(staking.address, memo.address);

    // Deploy staking helper
    const StakingHelper = await ethers.getContractFactory('StakingHelper');
    const stakingHelper = await StakingHelper.deploy(staking.address, time.address);

    const SimpleReadAccessController = await ethers.getContractFactory("SimpleReadAccessController");
    const aggregatorAccessController = await SimpleReadAccessController.deploy();
    await aggregatorAccessController.addAccess(deployer.address);
    await aggregatorAccessController.addAccess(treasury.address);

    const MockAggregator = await ethers.getContractFactory('MockAggregator');
    const mockAggregator = await MockAggregator.deploy()
    const Aggregator = await ethers.getContractFactory('EACAggregatorProxy');
    const aggregator = await Aggregator.deploy(mockAggregator.address, aggregatorAccessController.address);

    // Deploy MIM bond
    //@dev changed function call to Treasury of 'valueOf' to 'valueOfToken' in BondDepository due to change in Treasury contract
    const MIMBond = await ethers.getContractFactory('contracts/EthBondDepository.sol:TimeBondDepository');
    const mimBond = await MIMBond.deploy(time.address, mim.address, treasury.address, MockDAO.address, aggregator.address);
    // Set MIM bond terms
    await mimBond.initializeBondTerms(mimBondBCV, minBondPrice, maxBondPayout, maxBondDebt, intialBondDebt, bondVestingLength);

    await aggregatorAccessController.addAccess(mimBond.address);

    // queue and toggle MIM bond reserve depositor
    await treasury.queue('0', mimBond.address);
    await treasury.toggle('0', mimBond.address, zeroAddress);

    // Set staking for MIM bond
    await mimBond.setStaking(staking.address, stakingHelper.address);

    // Initialize Memories and set the index
    await memo.initialize(staking.address);
    await memo.setIndex(initialIndex);

    // set distributor contract and warmup contract
    await staking.setContract('0', distributor.address);
    await staking.setContract('1', stakingWarmup.address);

    // Set treasury for Time token
    await time.setVault(treasury.address);

    // Add staking contract as distributor recipient
    await distributor.addRecipient(staking.address, initialRewardRate);

    // queue and toggle reward manager
    await treasury.queue('8', distributor.address);
    await treasury.toggle('8', distributor.address, zeroAddress);

    // queue and toggle reward manager
    await treasury.queue('8', mimBond.address);
    await treasury.toggle('8', mimBond.address, zeroAddress);

    // queue and toggle deployer reserve depositor
    await treasury.queue('0', deployer.address);
    await treasury.toggle('0', deployer.address, zeroAddress);

    // queue and toggle liquidity depositor
    await treasury.queue('4', deployer.address,);
    await treasury.toggle('4', deployer.address, zeroAddress);

    // Approve the treasury to spend MIM
    await mim.approve(treasury.address, largeApproval);

    // Approve mim bonds to spend deployer's MIM
    await mim.approve(mimBond.address, largeApproval);

    // Approve staking and staking helper contact to spend deployer's OHM
    await time.approve(staking.address, largeApproval);
    await time.approve(stakingHelper.address, largeApproval);

    // Deposit 9,000,000 MIM to treasury, 600,000 Time gets minted to deployer and 8,400,000 are in treasury as excesss reserves
    await treasury.deposit('9000000000000000000000000', mim.address, '8400000000000000');

    // Deposit 5,000,000 Mim to treasury, all is profit and goes as excess reserves
    await treasury.deposit('5000000000000000000000000', mim.address, '5000000000000000');

    // Stake Time through helper
    await stakingHelper.stake('100000000000', deployer.address);

    // allow zapper
    // await mimBond.allowZapper(deployer.address);

    // Bond 1,000 Time
    await mimBond.deposit('10000000000000', '60000', deployer.address);

    console.log("Time: " + time.address);
    console.log("MIM: " + mim.address);
    console.log("Treasury: " + treasury.address);
    console.log("Calc: " + timeBondingCalculator.address);
    console.log("Staking: " + staking.address);
    console.log("Memo: " + memo.address);
    console.log("Distributor " + distributor.address);
    console.log("Staking Warmup " + stakingWarmup.address);
    console.log("Staking Helper " + stakingHelper.address);
    console.log("MIM Bond: " + mimBond.address);

    return {
        time,
        mim,
        treasury,
        timeBondingCalculator,
        staking,
        memo,
        distributor,
        stakingWarmup,
        mimBond
    }
}