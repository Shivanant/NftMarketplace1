// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, artifacts } = require("hardhat");
const fs=require("fs");
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  const NFT= await ethers.getContractFactory('NFT');
  const nft= await NFT.deploy();
  await nft.deployed()
  console.log(`the nft contract is deployed at address:${nft.address}`)

  
  const MARKETPLACE= await ethers.getContractFactory('Marketplace');
  const marketplace= await MARKETPLACE.deploy(1);
  await marketplace.deployed()
  console.log(`the MARKETPLACE contract is deployed at address:${marketplace.address}`)

  Makefrontenddata(marketplace,"Marketplace")
  Makefrontenddata(nft,"NFT")

  
  
}

const Makefrontenddata=(contract,contractName)=>{


  const contractDir=__dirname+"../../src/ContractData";
  if(!fs.existsSync(contractDir)){
    fs.mkdirSync(contractDir)
  }

  fs.writeFileSync(
    contractDir+`/${contractName}--address.json`,
    JSON.stringify({address:contract.address})
  )
  const contractArtifact=artifacts.readArtifactSync(contractName);

  fs.writeFileSync(
    contractDir+`/${contractName}.json`,
    JSON.stringify(contractArtifact)
  );

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
