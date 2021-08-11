const hre = require("hardhat");
const { saveContractAddress } = require('./utils')

async function main() {
  const tokenName = "Fizibu";
  const symbol = "FZB";
  const totalSupply = "1000000000000000000000000000";
  const decimals = 18;

  const FZBToken = await hre.ethers.getContractFactory("FZBToken");
  const token = await FZBToken.deploy(tokenName, symbol, totalSupply, decimals);
  await token.deployed();
  console.log("FZB Token deployed to: ", token.address);

  saveContractAddress(hre.network.name, "FZBToken", token.address);
}


main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
