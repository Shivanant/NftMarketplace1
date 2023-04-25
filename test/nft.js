const {expect}=require("chai");
const { ethers } = require('hardhat');

const toWei=(num)=>ethers.utils.parseEther(num.toString());
const fromWei=(num)=>ethers.utils.formatEther(num);

describe("nftMarketplace",async ()=>{
    let acc1,acc2,acc3,nft,deployer,marketplace;
    let feePercent=1;
    let uri="test uri";

    beforeEach(async()=>{
        
        const Marketplace= await ethers.getContractFactory("Marketplace");
        
        [deployer,acc1,acc2,acc3]= await ethers.getSigners();
        marketplace= await Marketplace.connect(deployer).deploy(feePercent);

        const NFT = await ethers.getContractFactory("NFT");
        nft= await NFT.deploy();
    })
    describe("Deployment",async()=>{
        it("returns Deployer address",async()=>{
            expect(await marketplace.feeaddress()).to.be.equal(deployer.address);
        })
        it("returns nft contract details",async()=>{
            expect(await nft.symbol()).to.be.equal("Dapp");
            expect(await nft.name()).to.be.equal("Dapp NFT");
        })
    })

    describe("Minting",async()=>{
        it("mints and return token count",async()=>{
            await nft.connect(acc1).mint(uri);
            expect(await nft.tokenID()).to.be.equal(1);
            //token cnt increase;
            await nft.connect(acc2).mint(uri);
            expect(await nft.tokenID()).to.be.equal(2);
            expect(await nft.tokenURI(1)).to.be.equal(uri);
            expect(await nft.balanceOf(acc1.address)).to.be.equal(1);
            expect(await nft.balanceOf(acc2.address)).to.be.equal(1);
            expect(await nft.balanceOf(acc3.address)).to.be.equal(0);
        })
       
    })
    describe("Making of marketplace item",async()=>{
        beforeEach(async()=>{
            await nft.connect(acc1).mint(uri);
            await nft.connect(acc1).setApprovalForAll(marketplace.address,true);

        })
        it("emmits event Offered,change owner of nft,increases item count of marketplace",async()=>{
            expect(await marketplace.connect(acc1).makeItem(
                nft.address,
                toWei(1),
                1
            )).to.emit(marketplace,"Offered")
            .withArgs(
                1,
                nft.address,
                1,
                toWei(1),
                acc1.address
            )
            expect(await nft.ownerOf(1)).to.be.equal(marketplace.address);
            expect(await marketplace.itemcnt()).to.be.equal(1);

            const item = await marketplace.Items(1);    
            expect(item.itemid).to.be.equal(1);
            expect(item.price).to.be.equal(toWei(1));
            expect(item.tokenid).to.be.equal(1);
            expect(item.nft).to.be.equal(nft.address);
            expect(item.sold).to.be.equal(false);
           })
        it("fails if the price is zero",async()=>{
            expect(await marketplace.connect(acc1).makeItem(
                nft.address,
                toWei(1),
                1
            )).to.revertedWith("priceshould be greater than 0");    
        })
       
    });
    describe("Purchasing of marketplace item",async()=>{
        let price=2;
        let totalPriceSend;
        let fee = (feePercent/100)*price
        let sellerBalBefore;
        let sellerBalAfter;
        let recieverBalBefore;
        let recieverBalAfter;
        let feeAccBefore;
        let feeAccAfter;
        
        beforeEach(async()=>{
            await nft.connect(acc1).mint(uri);
            await nft.connect(acc1).setApprovalForAll(marketplace.address,true);
            await marketplace.connect(acc1).makeItem(nft.address,toWei(price),1);
            sellerBalBefore=await acc1.getBalance();
            // sellerBalBefore=sellerBalBefore.parseInt()
            recieverBalBefore=await acc2.getBalance();
            // recieverBalBefore=recieverBalBefore.parseInt();
            feeAccBefore= await deployer.getBalance();



        })
        it("emit Bought event,change the owner of nft,sends money to seller,sets item to sold",async()=>{
            totalPriceSend= await marketplace.getTotalPrice(1);

            expect(await marketplace.connect(acc2).purchaseItem(1,{value:totalPriceSend})).to.emit(marketplace,'Bought')
            .withArgs(
                1,
                nft.address,
                1,
                toWei(price),
                acc1.address,
                acc2.address
            );
            //transferof ownership 
            expect(await nft.ownerOf(1)).to.be.equal(acc2.address);
            sellerBalAfter=await acc1.getBalance();
            // sellerBalAfter=sellerBalAfter.parseInt();
            recieverBalAfter= await acc2.getBalance();
            // recieverBalAfter=recieverBalAfter.parseInt();

            // console.log(fromWei(sellerBalBefore)+" ");
            // console.log(fromWei(totalPriceSend)+" ");
            // console.log(fee+"  ");
            // console.log(fromWei(sellerBalAfter))     
            //sellers account       
            expect(+fromWei(sellerBalAfter)).to.be.equal( +fromWei(totalPriceSend) + +fromWei(sellerBalBefore) - fee);
            // //reciever account        important * the gas is also getting cut from reciecer to nft 
            // expect(+fromWei(recieverBalAfter)).to.be.equal(+fromWei(recieverBalBefore) - +fromWei(totalPriceSend))
            expect((await marketplace.Items(1)).sold).to.be.equal(true);   

            feeAccAfter= await deployer.getBalance();
            expect(+fromWei(feeAccAfter)).to.be.equal(+fromWei(feeAccBefore) + +fee);

        });
    })
})