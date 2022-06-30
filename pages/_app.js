import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import Header from "../components/Header";
import { Fragment } from "react";
import Head from "next/head";
import { NorificationProvider, NotificationProvider } from "web3uikit";

const APP_ID = process.env.NEXT_PUBLIC_MORALIS_APP_ID;
const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Head>
        <title>Nft Marketplace</title>
        <meta
          name="description"
          content="Fully decentralized Nft Marketplace"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
        <NotificationProvider>
          <Header />
          <Component {...pageProps} />
        </NotificationProvider>
      </MoralisProvider>
    </Fragment>
  );
}

export default MyApp;
