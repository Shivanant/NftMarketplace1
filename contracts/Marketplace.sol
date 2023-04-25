// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard{

    address payable public immutable feeaddress;
    uint public feePercent;
    uint public itemcnt;


    struct Item{
        address payable seller;
        uint tokenid;
        uint itemid;
        uint price;
        IERC721 nft;
        bool sold;
    }
    mapping (uint => Item) public Items;

    event Offered(
        uint itemcnt,
        address indexed nft,
        uint tokenid,
        uint price,
        address indexed seller
    );
    
    event Bought(
        uint itemcnt,
        address indexed nft,
        uint tokenid,
        uint price,
        address indexed seller,
        address indexed buyer
        
    );


    constructor(uint _feePercent){
        feePercent=_feePercent;
        feeaddress=payable(msg.sender);
    }



    function makeItem(IERC721 _nft,uint _price,uint _tokenid)external nonReentrant{
        require(_price>0,"priceshould be greater than 0");
        itemcnt++;
        _nft.transferFrom(msg.sender, address(this), _tokenid);
        Items[itemcnt]= Item(
            payable(msg.sender),
            _tokenid,
            itemcnt,
            _price,
            _nft,
            false
        );

        emit Offered(itemcnt,address(_nft),_tokenid,_price,msg.sender);
    }

    function purchaseItem(uint _itemId) external payable nonReentrant{
        uint totalprice=getTotalPrice(_itemId);
        Item storage item=Items[_itemId];
        require(_itemId>0 && _itemId<= itemcnt,"enter valid item id");   
        require(msg.value>=totalprice,"not enough funds send");
        require(!item.sold,"already sold");


        item.seller.transfer(item.price);
        feeaddress.transfer(totalprice-item.price);
        item.sold=true;
        item.nft.transferFrom(address(this), msg.sender, item.tokenid);

        emit Bought(_itemId, address(item.nft), item.tokenid, item.price, item.seller, msg.sender); 
    }

    function getTotalPrice(uint itemid) public view returns(uint){
        return (Items[itemid].price*(100 + feePercent)/100);
    }
}