const hre = require("hardhat");
const { getSavedContractAddresses, saveContractAddress } = require('./utils')
const { ethers, web3 } = hre
const BigNumber = ethers.BigNumber

async function main() {

    const contracts = getSavedContractAddresses()[hre.network.name];

    const startSecond = 1622314800;

    const rewardsPerSecond = ethers.utils.parseEther("0.5");

    const allocPoints = {
        lp: 400,
        FZB: 200,
        placeHolder: 2850
    };

    const FarmingFZB = await hre.ethers.getContractFactory('FarmingFZB');

    const farmingFZB = await FarmingFZB.deploy(
        contracts["FZBToken"],
        rewardsPerSecond,
        startSecond
    );
    await farmingFZB.deployed();
    console.log('FarmingFZB deployed: ', farmingFZB.address);
    saveContractAddress(hre.network.name, 'FarmingFZB', farmingFZB.address);

    await farmingFZB.add(allocPoints.lp, contracts['LpToken'], true);
    await farmingFZB.add(allocPoints.FZB, contracts['FZBToken'], true);
    await farmingFZB.add(allocPoints.placeHolder, contracts['DevToken'], true);

    const FZB = await hre.ethers.getContractAt('FZBToken', contracts['FZBToken']);
    const devToken = await hre.ethers.getContractAt('DevToken', contracts['DevToken']);

    let totalRewards = ethers.utils.parseEther("500000");
    await FZB.approve(farmingFZB.address, totalRewards);
    console.log('Approval for farm done properly.');

    const totalSupplyDevToken = ethers.utils.parseEther('10000');
    await devToken.approve(farmingFZB.address, totalSupplyDevToken);
    console.log('Dev token successfully approved.');

    await farmingFZB.deposit(2, totalSupplyDevToken);
    console.log('Dev token deposited amount: ', totalSupplyDevToken);

    // await farmingFZB.fund(totalRewards);
    // console.log('Funded farm.');

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
