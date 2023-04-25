import { useEffect, useState } from "react";

const Purchase =({marketplace,nft,account})=>{
    const [purchases,setPurchase]=useState([])
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
                image:metadata.description
            }
            return purchaseItem
        }))
        console.log("errer here")
        setPurchase(purchases)
    }


    useEffect(()=>{
        loadPurchaseItem()
    },[])


    return(

        <div>
            {purchases.map((itm,id)=>(
                <div key={id}>
                    {itm.image}
                </div>


            ))}
        </div>
    )
}
export default Purchase;