import styles from "../styles/Home.module.css";
import { useMoralisQuery, useMoralis } from "react-moralis";
import NftPreview from "../components/NftPreview";

export default function Home() {
  const { isWeb3Enabled } = useMoralis();

  const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
    "ActiveItem",
    (query) => query.limit(10).descending("tokenId")
  );

  return (
    <div className={styles.container}>
      <h2>Recently Listed:</h2>
      <div className={styles.cardsContainer}>
        {isWeb3Enabled ? (
          fetchingListedNfts ? (
            <div>Loading...</div>
          ) : (
            listedNfts.map((nft) => {
              const { price, nftAddress, tokenId, marketplaceAddress, seller } =
                nft.attributes;
              return (
                <div>
                  <NftPreview
                    price={price}
                    tokenId={tokenId}
                    nftAddress={nftAddress}
                    seller={seller}
                    key={`${nftAddress}${tokenId}`}
                    marketplaceAddress={marketplaceAddress}
                  />
                </div>
              );
            })
          )
        ) : (
          <div>Connect to Web3 to see NFTs!</div>
        )}
      </div>
    </div>
  );
}
