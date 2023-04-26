import { useEffect, useState } from "react";

const Listing= ({marketplace,nft,account})=>{
    const [listItems,setListItems]=useState([]);
    const [loading, setLoading] = useState(true)



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
        setLoading(false);

    }
    useEffect(()=>{
        loadListedItem()
    })
    return(
        <div>{

            (loading)?<div className="loading"></div>:
            (listItems.length>0)?
        <div className="cards">
        {
            listItems.map((itm,idx)=>(
                <div className="card"id={idx}  key={idx} >
              <div className="image">
                 <img src={itm.image} alt={itm.image} ></img>
              </div>
              <div className="information">
              <h2>{itm.name} </h2>
              <p>{itm.description}</p>
              
              </div>
              </div>
                

            ))
        }
            
        
        </div>
        :
        <div className="no-items"><h1>No Items Here</h1></div>
        }
        </div>
    )
}
export default Listing;