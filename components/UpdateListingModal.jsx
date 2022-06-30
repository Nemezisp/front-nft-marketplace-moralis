import { useState } from "react"
import { Modal, Input, useNotification } from "web3uikit"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import {ethers} from "ethers";

const UpdateListingModal = ({tokenId, nftAddress, isVisible, onClose, marketplaceAddress}) => {
    
    const [newPrice, setNewPrice] = useState(null)
    
    const dispatch = useNotification()

    const {runContractFunction: updateListing} = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress,
            tokenId,
            price: ethers.utils.parseEther(newPrice || "0")
        }
    })

    const handleUpdateSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type:"success",
            message:"Listing Updated",
            title:"Listing Updated! (please refresh and move blocks if on localhost)",
            position: "topR"
        })
        onClose && onClose()
        setNewPrice(null)
    }

    return (
        <Modal isVisible={isVisible} 
               onOk={() => {
                    updateListing({
                        onError: (error) => {
                            console.log(error)
                        },
                        onSuccess: handleUpdateSuccess
                    }) 
               }}
               onCancel={onClose} 
               onCloseButtonPressed={onClose}>
            <Input 
                label="Update listing price in ETH" 
                name="New price" 
                type="number"
                onChange={(event) => {
                    setNewPrice(event.target.value)
                }}
            />
        </Modal>
    )
}

export default UpdateListingModal