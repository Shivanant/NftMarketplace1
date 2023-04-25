// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage{

    
    uint public tokeCount;
    constructor()ERC721('Dapp NFT','Dapp'){
    }



    function mint(string memory tokenURI) external returns(uint){
        tokeCount++;
        _safeMint(msg.sender, tokeCount);
        _setTokenURI(tokeCount, tokenURI);
        return (tokeCount);
    }


}