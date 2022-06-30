import { useEffect, useState } from "react";
import styles from "./NftPreview.module.css"
import Image from "next/image"
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/BasicNft.json"
import {Card, useNotification} from "web3uikit"
import {ethers} from "ethers"
import UpdateListingModal from "./UpdateListingModal";

const NftPreview = ({price, nftAddress, tokenId, seller, marketplaceAddress}) => {

    const {isWeb3Enabled, account} = useMoralis()
    const [imageURL, setImageURL] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const hideUpdateModal = () => setShowUpdateModal(false)

    const dispatch = useNotification()

    const {runContractFunction: getTokenUri} = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId
        }
    })

    const {runContractFunction: buyItem} = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress,
            tokenId
        }
    })

    const updateUi = async () => {{}
        const tokenUri = await getTokenUri()
        if (tokenUri) {
            const requestURL = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenUriResponse = await (await fetch(requestURL)).json()
            const imageURL = tokenUriResponse.image.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURL(imageURL)
            setTokenName(tokenUriResponse.name)
            setTokenDescription(tokenUriResponse.description)
        }
    }

    const handleBuyItemSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type:"success",
            message:"Item bought!",
            title:"Item bought! (please refresh and move blocks if on localhost)",
            position: "topR"
        })
    }

    const isOwnedByUser = seller === account;
    const formattedSellerAddress = isOwnedByUser ? "You!" : (seller.slice(0, 10) + "...")

    const handleCardClick = () => {
        isOwnedByUser ? setShowUpdateModal(true) : buyItem({
            onError: (error) => console.log(error),
            onSuccess: handleBuyItemSuccess
        }) 
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUi()
        }
    }, [isWeb3Enabled])

    return (
       <div>
            {imageURL 
            ? <div> 
                <UpdateListingModal isVisible={showUpdateModal} tokenId={tokenId} onClose={hideUpdateModal} nftAddress={nftAddress} marketplaceAddress={marketplaceAddress}/>
                    <Card onClick={handleCardClick} title={tokenName} description={tokenDescription}>
                        <div className={styles.card} >
                            <div>#{tokenId}</div>
                            <div>Owned by: {formattedSellerAddress}</div>
                            <Image loader={() => imageURL} src={imageURL} height={200} width={200}/>
                            <div>{ethers.utils.formatUnits(price, "ether")} ETH</div>
                        </div>
                    </Card>
              </div>
            : <div>Loading...</div>}
       </div>
    )
}

export default NftPreview;