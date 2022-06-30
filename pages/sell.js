import styles from "../styles/Sell.module.css";
import { Form, useNotification } from "web3uikit";
import { ethers } from "ethers";
import nftAbi from "../constants/BasicNft.json";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "../constants/networkMapping.json";

export default function SellPage() {
  const { chainId } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  const marketplaceAddress = networkMapping[chainString].NftMarketplace[0];

  const { runContractFunction } = useWeb3Contract();

  const dispatch = useNotification();

  const approveAndList = async (data) => {
    const nftAddress = data.data[0].inputResult;
    const tokenId = data.data[1].inputResult;
    const price = ethers.utils
      .parseUnits(data.data[2].inputResult, "ether")
      .toString();

    const approveOptions = {
      abi: nftAbi,
      contractAddress: nftAddress,
      functionName: "approve",
      params: {
        to: marketplaceAddress,
        tokenId,
      },
    };

    await runContractFunction({
      params: approveOptions,
      onSuccess: (tx) => handleApproveSuccess(tx, nftAddress, tokenId, price),
      onError: (error) => console.log(error),
    });
  };

  const handleApproveSuccess = async (tx, nftAddress, tokenId, price) => {
    await tx.wait(1);
    const listOptions = {
      abi: nftMarketplaceAbi,
      contractAddress: marketplaceAddress,
      functionName: "listItem",
      params: {
        nftAddress,
        tokenId,
        price,
      },
    };

    await runContractFunction({
      params: listOptions,
      onSuccess: handleListSuccess,
      onError: (error) => console.log(error),
    });
  };

  const handleListSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Item Listed!",
      title: "Item Listed! (please refresh and move blocks if on localhost)",
      position: "topR",
    });
  };

  return (
    <div className={styles.container}>
      <h2>Sell your NFT!</h2>
      <Form
        onSubmit={approveAndList}
        data={[
          {
            name: "NFT Address",
            type: "text",
            inputWidth: "50%",
            value: "",
            key: "nftAddress",
          },
          {
            name: "Token ID",
            type: "number",
            inputWidth: "50%",
            value: "",
            key: "tokenId",
          },
          {
            name: "Price (ETH)",
            type: "number",
            inputWidth: "50%",
            value: "",
            key: "price",
          },
        ]}
      />
    </div>
  );
}
