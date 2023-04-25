import {create} from "ipfs-http-client";
import { useState } from "react";
import {Buffer} from 'buffer';
import { ethers } from "ethers";

const projectId=process.env.REACT_APP_PROJECTID;
const projectSecret=process.env.REACT_APP_SECTETKEY;


const auth ='Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth 
    },
});




const Create =({marketplace ,nft})=>{
    const [image,setImg]=useState('');
    const [name,setName]=useState('');
    const [description,setDescreption]=useState('')
    const [price,setPrice]=useState(null);

    const uploadToIPFS=async(event)=>{
        event.preventDefault()
        const file=event.target.files[0];
        if( typeof file!=="undefined"){
            try{
                const result= await client.add(file);
                console.log(result);
                setImg(`https://ipfs.io/ipfs/${result.path}`)
            }catch(err){
                console.log(`the error in uploading` ,err)

            }
        }
    }
    const createNft= async()=>{
        
        if(!image ||!name || !description || !price)return;

        try{
                        
            let result= await client.add(JSON.stringify({image, price, name, description}))
            console.log(result);
            mintThenList(result);


        }catch(err){
            console.log(`the error in creating`,err);
        }
    }

    const mintThenList=async(result)=>{
        console.log("mintthenlist")

try{

        const uri=`https://ipfs.io/ipfs/${result.path}`
         console.log(`the tokenuri is ${uri}`)
        await(await nft.mint(uri)).wait();
        let id=await nft.tokeCount();
        await(await nft.setApprovalForAll(marketplace.address,true)).wait();
        const listingPrice = ethers.utils.parseEther(price.toString())
        console.log(`the listing price is${listingPrice}`)
        console.log(id)

        await(await marketplace.makeItem(nft.address,listingPrice, id)).wait()
        let itemCount= await marketplace.itemcnt();
        console.log(itemCount)
}catch(e){
    console.log('the err in mint and list is',e)
}

    }





    return (
        <div className="create">

        <label >
        <span>Upload image</span>
        <input type="file" onChange={uploadToIPFS}></input>
        </label>

        <label>
        <span>Name</span>
        <input type="text" onChange={(e)=>{setName(e.target.value)}}></input>
        </label>

        <label>
        <span>Descreption</span>
        <input type="text" onChange={(e)=>{setDescreption(e.target.value)}}></input>
        </label>
        

        <label>
        <span>Price</span>
        <input type="number" onChange={(e)=>{setPrice(e.target.value)}}></input>
        </label>
        
        <button onClick={createNft}>Submit</button>
        </div>
    )
}
export default Create;