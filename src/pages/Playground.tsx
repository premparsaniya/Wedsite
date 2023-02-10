import { useEffect, useState } from 'react'
// import Web3 from 'web3'
import Web3API from 'web3';
import { ethers } from "ethers";

const Playground = () => {
    const [web3State, setWeb3] = useState({
        "account": { "address": "", "privateKey": "" },
        "wallet": { "address": "", "privateKey": "", "index": -1 },
        "keystore": {
            "version": 0, "id": "", "address": "",
            "crypto": {
                "ciphertext": "", "cipherparams": { "iv": "" }, "cipher": "", "kdf": "",
                "kdfparams": { "dklen": -1, "salt": "", "n": -1, "r": -1, "p": -1 }, "mac": ""
            }
        }
    });
    const [mnemonic, setMnemonic] = useState("");
    const [phaseType, setPhaseType] = useState(16);
    const [walletInfo, setWalletInfo] = useState<ethers.Wallet>();

    const web3 = new Web3API(new Web3API.providers.HttpProvider('https://mainnet.infura.io/'));
    let account = web3.eth.accounts.create(web3.utils.randomHex(32));
    let wallet = web3.eth.accounts.wallet.add(account);
    let keystore = wallet.encrypt(web3.utils.randomHex(32));

    const createAnew = () => {

        // console.warn((JSON.stringify({ account, wallet, keystore }, null, 3)));

        // // now generate 24 words mnemonic phrase;
        // let mnemonic = ethers.utils.entropyToMnemonic(web3.utils.randomHex(32));
        // console.warn("24_words_mnemonic_phrase:", mnemonic);

        // // now generate 12 words mnemonic phrase;
        // let mnemonic12 = ethers.utils.entropyToMnemonic(web3.utils.randomHex(16));
        // console.warn("12_words_mnemonic_phrase:", mnemonic12);
        setMnemonic(ethers.utils.entropyToMnemonic(web3.utils.randomHex(phaseType)));
        setWeb3({ account, wallet, keystore });
    };

    const confirmMnemonic = () => {
        // create a new wallet from mnemonic phrase
        let wallet = ethers.Wallet.fromMnemonic(mnemonic);
        console.warn("wallet:", JSON.stringify(wallet, null, 3));
        setWalletInfo(wallet);
    };

    const importWalletUsingPrivateKey = () => {
        // create a new wallet from private key
        let wallet = new ethers.Wallet(web3State.account.privateKey);
        console.warn("wallet:", JSON.stringify(wallet, null, 3));
        setWalletInfo(wallet);
    };

    const getEthBalance = async () => {
        let balance = await web3.eth.getBalance(web3State.wallet.address);
        console.warn("balance:", balance);
    };

    const getEthBalanceInUSD = async () => {
        let balance = await web3.eth.getBalance(web3State.wallet.address);
        let balanceInUSD = web3.utils.fromWei(balance, 'ether');
        balanceInUSD = web3.utils.toWei(balanceInUSD, 'ether');
        console.warn("balanceInUSD:", balanceInUSD);
    };


    return (
        <div className="up-main d-f" style={{ backgroundColor: "wheat" }} >
            <h1>STATE Playground (Create wallet)</h1>

            <input type="radio" id="24" name="phaseType" value="24" checked={phaseType === 32} onChange={() => setPhaseType(32)} />
            <label htmlFor="24">24-phase</label>

            <input type="radio" id="12" name="phaseType" value="12" checked={phaseType === 16} onChange={() => setPhaseType(16)} />
            <label htmlFor="12">12-phase</label>

            <br />
            <br />

            <button onClick={createAnew}>Create a new wallet</button>

            <br />
            <h5>Account-address: {web3State.account.address || "--"}</h5>
            <h5>Account-Private_Key: {web3State.account.privateKey || "--"}</h5>
            <h4 style={{ /* textAlign: "center" */ }}>-:Phases:- {
                // split with comma
                mnemonic.split(" ").map((phase, index) => {
                    return (
                        <section key={index} className="d-f" style={{ flexDirection: "row", alignSelf: 'flex-start', justifyContent: "flex-start" }}>
                            <p>{index + 1})</p>
                            <p style={{ opacity: 0 }}>--</p>
                            <br />
                            <span style={{ color: "red" }}>{`    ${phase}`} </span>
                        </section>
                    )
                })
            }</h4>
            <pre>Keystore-info (version): {web3State.keystore.id ? JSON.stringify(web3State.keystore, null, 3) : "--"}</pre>

            <br />
            <h4>Create wallet</h4>
            <button onClick={confirmMnemonic}>Using Mnemonic</button>
            <button onClick={importWalletUsingPrivateKey}>Using Private Key</button>

            <br />
            <pre>Wallet-info: {walletInfo?.address ? JSON.stringify(walletInfo, null, 3) : "--"}</pre>


            <br />
            <h4>Get Balance</h4>
            <button onClick={getEthBalance}>Get Balance</button>
            <button onClick={getEthBalanceInUSD}>Get Balance in USD</button>
        </div>
    )
}

export default Playground;