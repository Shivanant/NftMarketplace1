import { useEffect, useState } from "react";
import { ethers } from "ethers";


const Home=({marketplace,nft})=>{
    const [items,setItems]=useState([])
    const [loading, setLoading] = useState(true)
    
    const loadmarketplaceitems=async()=>{
        let itemCount= await marketplace.itemcnt();
         let items=[];
        for(let i=1;i<=itemCount;++i){
            let item= await marketplace.Items(i);

            if(!item.sold){
                let uri = await nft.tokenURI(item.tokenid);
                let response= await fetch(uri)
                let metadata= await response.json();

                let totalPrice= await marketplace.getTotalPrice(item.itemid);

                items.push({
                    totalPrice,
                    image:metadata.image,
                    itemId:item.itemid,
                    seller:item.seller,
                    description: metadata.description,
                    name:metadata.name
                })

            }
        }
        setItems(items)
        setLoading(false)
    }

    const buyMarketplaceItem = async (item) => {
      console.log("this is buyMarketplaceItem")
      console.log(item)
      await(await marketplace.purchaseItem(item.itemId, {
        value: item.totalPrice
      })).wait()

      loadmarketplaceitems();
    };

    useEffect(() => {
      loadmarketplaceitems()
    },[]);
    return(<div>
     {
      (loading)?<div className="loading"></div>:       
       (items.length>0)?
        <div className="cards">
        {
            items.map((itm,idx)=>(

              <div className="card"id={idx}  key={idx} >
              <div className="image">
                 <img src={itm.image} ></img>
              </div>
              <div className="information">
              <h2>{itm.name} </h2>
              <p>{itm.description}</p>
              
              </div>
              <button onClick={()=>{
                buyMarketplaceItem(itm)
              }}><i className="fa-brands fa-ethereum"></i>  {ethers.utils.formatEther(itm.totalPrice)}</button>
              </div>
                

            ))
        }
            
        
        </div>
        :
        <div className="no-items" ><h1>No Items Here</h1> </div>
    }
    </div>
      
    )
}
export default Home;