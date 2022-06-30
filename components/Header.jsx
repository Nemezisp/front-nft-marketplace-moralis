import {ConnectButton} from "web3uikit"
import Link from "next/link"
import styles from "./Header.module.css"

const Header = () => {
    return (
        <nav className={styles.navBar}>
            <h1>NFT Marketplace</h1>
            <div className={styles.links}>
                <Link href="/">
                    <a>
                        Home
                    </a>
                </Link>
                <Link href="/sell">
                    <a>
                        Sell NFT
                    </a>
                </Link>
                <ConnectButton/>
            </div>
        </nav>
    )
}

export default Header;