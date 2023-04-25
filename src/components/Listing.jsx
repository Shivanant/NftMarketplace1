import { useEffect, useState } from "react";

const Listing= ({marketplace,nft,account})=>{
    const [listItems,setListItems]=useState([]);


    const loadListedItem=async()=>{
        const itmCnt=await marketplace.itemcnt();
        let listItems=[];
        for(var i=1;i<=itmCnt;++i){
            console.log('for')

            let itm= await marketplace.Items(i);
            if(itm.seller.toLowerCase() === account){
                let uri= await nft.tokenURI(itm.itemid);
                let response= await fetch(uri);
                let metadata =await response.json();
                console.log(metadata)
            
            console.log('if block')
                     
                listItems.push({
                    name:metadata.name,
                    image:metadata.image,
                    description: metadata.description,
                    
                    
                })
                
            }
        }
        setListItems(listItems);

    }
    useEffect(()=>{
        loadListedItem()
    },[])
    return(
        <div>{
            (listItems.length>0)?
        <div className="cards">
        {
            listItems.map((itm,idx)=>(
              <div className="card">
              <h2>{itm.image} </h2>
              name={itm.name} 
              description={itm.description}
              key={idx} </div>
                

            ))
        }
            
        
        </div>
        :
        <div> no item</div>
        }
        </div>
    )
}
export default Listing;