import css from "./Card.css";
import { ethers } from "ethers";
import ABI from "./ABI.json";
import { useState, useEffect } from "react";
import USDCABI from "./USDCABI.json";
import USDTABI from "./USDTABI.json";

function Card(props) {

    const [Bought, setBought] = useState(false);

    const checkBought = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const currentAddress = await provider.getSigner().getAddress();
        const marketplaceContract = new ethers.Contract("0x9AC7F15D2E05c9cCAae38d2b409969fd0E9cAc71", ABI, signer);
        const bought = await marketplaceContract.alreadyBought(currentAddress);
        setBought(bought);
        console.log(Bought);

    }

    const Connect = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send( "eth_requestAccounts" );
        console.log("Trying to connect");
    }

    const payInUSDC = async () => {
        Connect();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const currentAddress = await provider.getSigner().getAddress();
        const marketplaceAddress = "0x9AC7F15D2E05c9cCAae38d2b409969fd0E9cAc71";
        const marketplaceContract = new ethers.Contract(marketplaceAddress, ABI, signer);
        const token = new ethers.Contract("0x93C0689f4834D2e1b28142261Ab40B9E7eE16bD6", USDCABI, signer);

        const totalAmount = await token.balanceOf(currentAddress);
        const totalAllowed = await token.allowance(currentAddress, marketplaceAddress);
        const price = await marketplaceContract.price();

        console.log("TOTAL:" + totalAmount)
        console.log("ALLOWED:" + totalAllowed)
        console.log("PRICE:" + price);


        if (price <= totalAmount) {
            //They have enough to buy
            if (price <= totalAllowed) {
                //they can buy
                const purchase = await marketplaceContract.payInUSDC();
                setBought(purchase);
            } else {
                //they have enough money, but they need to allow it
                const approve = await token.approve(marketplaceAddress, price);
                const receipt = await approve.wait();
                if (receipt.confirmations > 0) {
                    const purchase = await marketplaceContract.payInUSDC();
                    setBought(purchase);
                }

            }
        } else {
            //they don't have enough to buy
        }
    }

    const payInUSDT = async () => {
        Connect();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const currentAddress = await provider.getSigner().getAddress();
        const marketplaceAddress = "0x9AC7F15D2E05c9cCAae38d2b409969fd0E9cAc71";
        const marketplaceContract = new ethers.Contract(marketplaceAddress, ABI, signer);
        const token = new ethers.Contract("0xB0d4C974DFB17fED8424b63753ca33342CEBFB13", USDTABI, signer);

        const totalAmount = await token.balanceOf(currentAddress);
        const totalAllowed = await token.allowance(currentAddress, marketplaceAddress);
        const price = await marketplaceContract.price();

        console.log("TOTAL:" + totalAmount)
        console.log("ALLOWED:" + totalAllowed)
        console.log("PRICE:" + price);


        if (price <= totalAmount) {
            //They have enough to buy
            if (price <= totalAllowed) {
                //they can buy
                const purchase = await marketplaceContract.payInUSDT();
                setBought(purchase);
            } else {
                //they have enough money, but they need to allow it
                const approve = await token.approve(marketplaceAddress, price);
                const receipt = await approve.wait();
                if (receipt.confirmations > 0) {
                    const purchase = await marketplaceContract.payInUSDT();
                    setBought(purchase);
                }

            }
        } else {
            //they don't have enough to buy
        }
    }

    const payInETH = async () => {
        Connect();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const currentAddress = await provider.getSigner().getAddress();
        const marketplaceAddress = "0x9AC7F15D2E05c9cCAae38d2b409969fd0E9cAc71";
        const marketplaceContract = new ethers.Contract(marketplaceAddress, ABI, signer);
        const amount = await provider.getBalance(currentAddress);
        const formatted = ethers.utils.formatEther(amount);
        console.log(formatted);
        const price = await marketplaceContract.returnETH();

        console.log(ethers.utils.formatEther(price));
        console.log(ethers.utils.formatEther(amount));

        if (ethers.utils.formatEther(amount) >= ethers.utils.formatEther(price)) {
            console.log("trying to buy");
            //they can buy
            const pay = await marketplaceContract.payInETH({ value: price });
            console.log(pay);
            const receipt = await pay.wait();
            if (receipt.confirmations > 0) {
                setBought(pay);
                console.log(pay);
            }

        } else {
            console.log("Not enough ETH" + amount + ":" + price);
            //they can't buy
        }



    }

    const payInBTC = async () => {
        Connect();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const currentAddress = await provider.getSigner().getAddress();
        const marketplaceAddress = "0x9AC7F15D2E05c9cCAae38d2b409969fd0E9cAc71";
        const marketplaceContract = new ethers.Contract(marketplaceAddress, ABI, signer);
        const amount = await provider.getBalance(currentAddress);
        const formatted = ethers.utils.formatEther(amount);
        console.log(formatted);
        const price = await marketplaceContract.returnBTC();

        console.log(ethers.utils.formatEther(price));
        console.log(ethers.utils.formatEther(amount));

        if (ethers.utils.formatEther(amount) >= ethers.utils.formatEther(price)) {
            console.log("trying to buy");
            //they can buy
            const pay = await marketplaceContract.payInBTC({ value: price });
            console.log(pay);
            const receipt = await pay.wait();
            if (receipt.confirmations > 0) {
                setBought(pay);
                console.log(pay);
            }

        } else {
            console.log("Not enough BTC" + amount + ":" + price);
            //they can't buy
        }



    }

    useEffect(() => {
        checkBought();
    }, []);

    return (
        <div className="card">
            <div class="card__image-container">
                <img
                    src={props.imageURL}
                    width="400"
                />

            </div>
            <div class="card__content">
                <p class="card__title text--medium">
                    {props.name}
                </p>
                <div class="card__info">
                    <p class="text--medium">{props.description} </p>

                </div>

                {Bought == true ?

                    <div>
                        <p class="card__price text__price">
                            <a href="/Item1">view your product</a></p>
                    </div>
                    :
                    <div>
                        <div>
                            <img onClick={payInUSDC} class="buyIcon" src="https://imgur.com/MQHRBrg.png"></img>
                            <img onClick={payInUSDT} class="buyIcon" src="https://imgur.com/wndKTZS.png"></img>
                            <img onClick={payInETH} class="buyIcon" src="https://imgur.com/sQsv7UD.png"></img>
                            <img onClick={payInBTC} class="buyIcon" src="https://imgur.com/viVcTZ5.png"></img>
                        </div>
                        <div>
                            <p class="card__price text__price">
                                10$</p>
                        </div>
                    </div>
                }

            </div>

        </div>

    );   


}

export default Card;