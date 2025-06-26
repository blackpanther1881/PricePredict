"use client";
import React, {useEffect, useState} from "react";
import {ConnectModal,ConnectButton, useCurrentAccount, } from "@mysten/dapp-kit";
import {NextPage} from "next";
import {Layout} from "@components/layout";
import {useAppStore} from "@store/index";
import {shallow} from "zustand/shallow";
import {mistToSuiDecimal} from "@utils/number";
import {usePricesQuery} from "../queries/use-prices-query";
import {useSessionTimer} from "../hooks/useSessionTimer";
import { useTransferHandler } from "../mutations/useTransferHandler";

const Home:NextPage = () => {
    const [flipped, setFlipped] = useState(false);
    const [txnStatus, setTxnStatus] = useState('');

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

    const { executeTransaction, isLoading: txLoading } = useTransferHandler({
        onSuccess: (txId: any) => {
            console.log(txId, "txId");
            setTxnStatus(txId);
            console.log("Transaction Success");
        },
        onError: (error: any) => {
            setTxnStatus('faield');
            console.log("Transaction Failed", error);
        },
        });

    const { data: priceData, isFetching:isPriceFetching } = usePricesQuery();

    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [warning, setWarning] = useState("");

    useEffect(() => {
        if (priceData && priceData.sui) {
            setTokenPrice(priceData.sui || 0);
        }

    }, [priceData]);

    const isAmountValid = () => {
        const amt = parseFloat(amount);
        return (
            amount !== "" &&
            !isNaN(amt) &&
            amt > 0 &&
            amt <= Number(mistToSuiDecimal(userBalance!))
        );
    };
    const isFormValid = address.trim() !== "" && isAmountValid();

    return (
        <Layout>
            <div className="relative max-w-md mx-auto h-[400px]">
               {/*<div className={"flex items-center justify-between mb-4"}>*/}
               {/*    <p>Duration</p>*/}
               {/*    <p>{String(minutes).padStart(2, "0")}:*/}
               {/*        {String(seconds).padStart(2, "0")}</p>*/}
               {/*</div>*/}
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
                                <span className="text-white font-semibold">Latest Price</span>
                            </div>
                            <span className="text-white font-semibold">{!isPriceFetching ? `$${tokenPrice}` : "Loading.."}</span>

                        </div>

                        <div className="h-[calc(100%-40px)] p-4 bg-gray-800 text-center rounded-b-2xl flex flex-col justify-between">
                            {/* UP */}
                            <div>

                                <div className={"mb-4"}>
                                    <h2 className="text-md text-white-600 text-left font-medium mb-1">To Address</h2>
                                    <input
                                        type="string"
                                        placeholder="Enter address"
                                        className="px-4 py-2 rounded-lg border border-black-100 text-white w-full mb-2"
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-4">
                                       <h2 className="text-md text-white-600 text-left font-medium mb-1">Amount</h2>
                                       <div >
                                           <span className="text-white font-semibold">Available Sui: </span>
                                           <span className="text-white text-sm font-semibold">{Number(mistToSuiDecimal(userBalance!)).toFixed(6)} Sui</span>
                                       </div>
                                   </div>
                                    <input
                                        type="number"
                                        placeholder="Enter amount"
                                        className="px-4 py-2 rounded-lg border border-black-100 text-white w-full mb-4"
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                    />
                                </div>
                                <button
                                    className="w-full py-2 rounded-xl bg-red-200 text-black font-bold hover:bg-primary-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!isFormValid}
                                    onClick={() => {
                                        if (!isFormValid) {
                                            if (address.trim() === "" || amount === "") {
                                                setWarning("Both address and amount are required.");
                                            } else if (!isAmountValid()) {
                                                setWarning("Amount must be greater than 0 and less than or equal to your available Sui.");
                                            }
                                            return;
                                        }
                                        setWarning("");
                                        executeTransaction({
                                            amount: amount.toString(),
                                            recipient: address,
                                        });
                                        setFlipped(true);
                                        setPosition("Down");
                                    }}
                                >
                                    Submit
                                </button>
                                {warning && (
                                    <div className="mt-2 text-red-400 text-sm font-semibold">{warning}</div>
                                )}
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
                                <span className="text-sm font-semibold">Transferring Amount: {amount || "0"}</span>
                            </div>
                            <span className="text-sm font-semibold"></span>
                        </div>
                
                        <div className="h-auto p-4 bg-gray-800 text-center rounded-2xl flex flex-col justify-between">
                            {txLoading ? (
                                <div className="flex items-center justify-center gap-2 bg-blue-900/80 border border-blue-400 text-blue-200 font-semibold rounded-lg px-4 py-3 mb-4">
                                    <svg className="animate-spin h-7 w-7 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                                    <span>Your transaction of {amount} Sui is being processed, Please wait...</span>
                                </div>
                            ) : txnStatus === 'faield' ? (
                                <div className="flex items-center justify-center gap-2 bg-red-900/80 border border-red-400 text-red-200 font-semibold rounded-lg px-4 py-3 mb-4">
                                    <svg className="h-7 w-7 text-red-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                    <span>Transaction failed, Please retry</span>
                                </div>
                            ) : txnStatus ? (
                                <div className="flex flex-col items-center justify-center gap-2 bg-green-900/80 border border-green-400 text-green-200 font-semibold rounded-lg px-4 py-3 mb-4">
                                    <div className="flex items-center gap-2">
                                        <svg className="h-7 w-7 text-green-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        <span>Transaction successful</span>
                                    </div>
                                    {txnStatus && txnStatus !== 'faield' && (
                                        <div className="mt-2 text-green-100 text-sm break-all">
                                            <span>Txn ID: </span>
                                            <a
                                                href={`https://suiexplorer.com/txblock/${txnStatus}?network=testnet`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline text-green-200 hover:text-green-400"
                                            >
                                                {txnStatus}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ) : null}
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
