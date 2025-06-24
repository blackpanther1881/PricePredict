"use client";
import React, {useEffect, useState} from "react";
import {ConnectModal,ConnectButton, useCurrentAccount} from "@mysten/dapp-kit";
import {NextPage} from "next";
import {Layout} from "@components/layout";
import {useAppStore} from "@store/index";
import {shallow} from "zustand/shallow";
import {mistToSuiDecimal} from "@utils/number";
import {usePricesQuery} from "../queries/use-prices-query";
import {useSessionTimer} from "../hooks/useSessionTimer";

const Home:NextPage = () => {
    const [flipped, setFlipped] = useState(false);

    const [position, setPosition] = useState<string>("");
    const currentAccount = useCurrentAccount();

    console.log(flipped, "flipped state", currentAccount?.address);
    const [userBalance, setTokenPrice,tokenPrice ] =
        useAppStore(
            (state) => [
                state.userBalance,
                state.setTokenPrice,
                state.tokenPrice
            ],
            shallow
        );

    const { data: priceData, isFetching:isPriceFetching } = usePricesQuery();

    useEffect(() => {
        if (priceData && priceData.sui) {
            setTokenPrice(priceData.sui || 0);
        }

    }, [priceData]);

    const { minutes, seconds } = useSessionTimer(() => {

    }, true);


    return (
        <Layout>
            <div className="relative max-w-xs mx-auto h-[400px]">
               <div className={"flex items-center justify-between mb-4"}>
                   <p>Duration</p>
                   <p>{String(minutes).padStart(2, "0")}:
                       {String(seconds).padStart(2, "0")}</p>
               </div>
                <div
                    className={`w-full h-full transition-transform duration-500 transform-style-preserve-3d `}
                    style={{
                        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                >
                    <div
                        style={{
                            zIndex: flipped ? 5 : 10,
                            transition: "z-index 600ms",
                        }}
                        className={`absolute w-full h-full backface-hidden rounded-2xl  overflow-hidden shadow-lg border border-gray-700`}
                    >
                        <div className="bg-primary-400 px-4 py-2 flex items-center justify-between rounded-t-2xl">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                <span className="text-sm font-semibold">Blc</span>
                            </div>
                            <span className="text-sm font-semibold">{Number(mistToSuiDecimal(userBalance!)).toFixed(6)} Sui</span>
                        </div>

                        <div className="h-[calc(100%-40px)] p-4 bg-gray-800 text-center rounded-b-2xl flex flex-col justify-between">
                            {/* UP */}
                            <div>
                                <p className="text-green-400 font-bold text-lg">UP</p>
                                <p className="text-sm text-gray-300 mb-4">1.5x Payout</p>

                                <div className="border border-teal-400 rounded-xl p-4 mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-white font-semibold">Latest Price</span>
                                        <span className="text-white font-semibold">{!isPriceFetching ? `${tokenPrice}` : "Loading.."}</span>
                                    </div>

                                    <div className="space-y-2">
                                        <button
                                            className="w-full py-2 rounded-xl bg-green-200 text-black font-bold hover:bg-green-100 transition"
                                            onClick={() => {
                                                setFlipped(true);
                                                setPosition("Up");
                                            }}
                                        >
                                            Enter UP
                                        </button>
                                        <button
                                            className="w-full py-2 rounded-xl bg-red-200 text-black font-bold hover:bg-primary-400 transition"
                                            onClick={() => {
                                                setFlipped(true);
                                                setPosition("Down");
                                            }}
                                        >
                                            Enter DOWN
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* DOWN */}
                            <div>
                                <p className="text-sm text-gray-300">1.5x Payout</p>
                                <p className="text-red-500 font-bold text-lg">DOWN</p>
                            </div>
                        </div>
                    </div>

                    {/* Back */}
                    <div
                        style={{
                            zIndex: flipped ? 10 : 5,
                            transition: "z-index 600ms",
                        }}
                        className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-gray-900 text-white p-4`}
                    >
                        <div className="bg-primary-400 px-4 py-2 flex items-center justify-between rounded-t-2xl mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                <span className="text-sm font-semibold">Position: {position}</span>
                            </div>
                            <span className="text-sm font-semibold"></span>
                        </div>
                        <h2 className="text-md font-bold mb-4">Enter Amount</h2>
                        <div className="h-auto p-4 bg-gray-800 text-center rounded-2xl flex flex-col justify-between">
                            <input
                                type="number"
                                placeholder="Enter amount"
                                className="px-4 py-2 rounded-lg text-white w-full mb-4"
                            />
                            {!currentAccount ? (
                                <ConnectModal trigger={ <button
                                    className={
                                        "w-full py-2 rounded-xl bg-primary-500 text-white font-bold hover:bg-green-400 mb-2"
                                    }
                                >
                                    Connect Wallet
                                </button>}/>
                            ) : (
                                <button className="w-full py-2 rounded-xl bg-primary-500 text-white font-bold hover:bg-green-400 transition mb-2">
                                    Submit
                                </button>
                            )}
                            <button
                                className="text-sm text-gray-400 hover:underline"
                                onClick={() => setFlipped(false)}
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </Layout>

    );
};

export default Home;
