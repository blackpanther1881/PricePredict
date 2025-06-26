import React, { useEffect, useState } from "react";
import {ConnectModal, useCurrentAccount, useDisconnectWallet} from "@mysten/dapp-kit";
import {stringTruncate} from "@utils/helpers";
import {useGetUserBalance} from "../../queries/use-balance-query";
import {shallow} from "zustand/shallow";
import {useAppStore} from "@store/index";
import {usePricesQuery} from "../../queries/use-prices-query";

export const Header = () => {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: disconnect } = useDisconnectWallet();
    const [userBalance, setUserBalance,setTokenPrice, resetUserSlice] =
        useAppStore(
            (state) => [
                state.userBalance,
                state.setUserBalance,
                state.setTokenPrice,
                state.resetUserSlice
            ],
            shallow
        );

    const { data: balanceData, isFetching } = useGetUserBalance({
        account: currentAccount ? currentAccount!.address : "",
    });

    useEffect(() => {
        if (balanceData) {
            setUserBalance(balanceData.toString());
        }
    }, [balanceData]);


    useEffect(() => {
        const authenticateHandler = async () => {
            const sessionStartStr = sessionStorage.getItem("sessionStart");
            if (currentAccount?.address && !sessionStartStr) {
                window.sessionStorage.setItem("sessionStart", Date.now().toString());
            }
        }
        authenticateHandler();
    }, [currentAccount?.address]);


    return (
      <div className={"bg-white-300"}>
          <div className={"max-w-[1440px] mx-auto flex justify-between items-center px-4 py-2"}>
                <p>
                    Header
                </p>
              {!currentAccount ? (
                  <ConnectModal trigger={ <button
                      className={
                          "w-max py-2 px-4 rounded-xl bg-primary-500 text-white font-bold hover:bg-green-400 mb-2"
                      }
                  >
                      Connect Wallet
                  </button>}/>
              ) : (
                 <div className={"flex gap-4"}>
                     <button className="w-max py-2 px-4 rounded-xl bg-primary-500 text-white font-bold hover:bg-green-400 transition mb-2">
                         {stringTruncate(currentAccount.address, 6)}
                     </button>
                     <button onClick={()=> {disconnect();resetUserSlice();}} className="w-max py-2 px-4 rounded-xl bg-primary-500 text-white font-bold hover:bg-green-400 transition mb-2">
                        Disconnect
                     </button>
                 </div>

              )}
          </div>
      </div>
  );
};
