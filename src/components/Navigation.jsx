import { NavLink } from "react-router-dom";
import "../App";
const NAVIGATION = ({ web3Handler, account }) => {
  const navlinkstyle = ({ isActive }) => {
    return {
      fontWeight: isActive ? "bold" : "normal",
    };
  };

  return (
    <nav  className="navbar">
      <div className="logo">NFT</div>
      <div>
        <NavLink style={navlinkstyle} to="/">
          Home
        </NavLink>
        <NavLink style={navlinkstyle} to="/create">
          Create
        </NavLink>
        <NavLink style={navlinkstyle} to="/mylisting">
          MyListing
        </NavLink>
        <NavLink style={navlinkstyle} to="/mypurchase">
          MyPurchase
        </NavLink>
        <NavLink style={navlinkstyle} to="/about">
          About
        </NavLink>
      </div>

        {account ? (
          <button>{account.slice(0, 4)}....{account.slice(12,16)}</button>
        ) : (
          <button onClick={web3Handler}>connect wallet</button>
        )}
    </nav>
  );
};

export default NAVIGATION;
