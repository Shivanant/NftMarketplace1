import { BrowserRouter, Routes, Route } from "react-router-dom";
import MarketplaceAbi from "./ContractData/Marketplace.json";
import MarketplaceAddress from "./ContractData/Marketplace--address.json";
import NFTAbi from "./ContractData/NFT.json";
import NFTAddress from "./ContractData/NFT--address.json";
import { useState } from "react";
import { ethers } from "ethers";
import Home from "./components/Home";
import Create from "./components/Create";
import Listing from "./components/Listing";
import Purchase from "./components/purchase";
import NAVIGATION from "./components/Navigation";
import About from "./components/About";

function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});
  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Set signer
    const signer = provider.getSigner();

    window.ethereum.on("chainChanged", (chainId) => {
      window.location.reload();
    });


    window.ethereum.on("accountsChanged", async function (accounts) {
      setAccount(accounts[0]);
      await web3Handler();
    });
    loadContracts(signer);

  };

  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const marketplace = new ethers.Contract(MarketplaceAddress.address,MarketplaceAbi.abi,signer);
    setMarketplace(marketplace);

    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
    setNFT(nft);
    setLoading(false);
    
  };

  return (
    <BrowserRouter>
      <div>
        <>
          <NAVIGATION web3Handler={web3Handler} account={account} />
        </>
        <div>
          {loading ? (
            <div className="no-items">
              <h1>Awaiting Metamask Connection...</h1>
            </div>
          ) : (
            <Routes>
              <Route
                path="/"
                element={<Home marketplace={marketplace} nft={nft} />}
              />
              <Route
                path="/create"
                element={<Create marketplace={marketplace} nft={nft} />}
              />
              <Route
                path="/mylisting"
                element={
                  <Listing
                    marketplace={marketplace}
                    nft={nft}
                    account={account}
                  />
                }
              />
              <Route
                path="/mypurchase"
                element={
                  <Purchase
                    marketplace={marketplace}
                    nft={nft}
                    account={account}
                  />
                }
              />
              <Route path="/about" element={<About />} />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
