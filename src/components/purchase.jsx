import { useEffect, useState } from "react";

const Purchase =({marketplace,nft,account})=>{
    const [purchases,setPurchase]=useState([])
    const [loading,setLoading]=useState(true);
    const loadPurchaseItem=async()=>{
        const filter= marketplace.filters.Bought(null,null,null,null,null,account);
        const result= await marketplace.queryFilter(filter)
        const purchases= await Promise.all(result.map(async (i)=>{
            i=i.args;
            let uri =await nft.tokenURI(i.tokenid);
            let resp= await fetch(uri);
            let metadata= await resp.json();
            let purchaseItem={
                name:metadata.name,
                description:metadata.description,
                image:metadata.image
            }
            return purchaseItem
        }))
        
        setPurchase(purchases)
        setLoading(false)
    }


    useEffect(()=>{
        loadPurchaseItem()
    })


    return(
        <div>
        {
            (loading)?<div className="loading"></div>:
            (purchases.length>0)?<div className="cards">
            {
                purchases.map((itm,idx)=>(
                <div className="card" id={idx}  key={idx} >
              <div className="image">
                 <img src={itm.image} alt={itm.image}></img>
              </div>
              <div className="information">
              <h2>{itm.name} </h2>
              <p>{itm.description}</p>
              
              </div>
              </div>

            ))}
        </div>:<div className="no-items"><h1>No Items Here</h1></div>
        }
        </div>
    )
}
export default Purchase;