import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useCurrentWallet,
  useSuiClient,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { getExplorerUrl } from "@utils/helpers";
import { mistToSui, suiToMist } from "@utils/number";

interface TransactionOptions {
  onSuccess?: (txId: string) => void;
  onError?: (error: Error) => void;
}

export const useTransferHandler = (options?: TransactionOptions) => {
  const { currentWallet } = useCurrentWallet();

  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  const executeTransaction = async ({
    amount,
    recipient
  }: {
    amount: string;
    recipient: string
  }) => {
    if (!currentWallet) throw new Error("Wallet not connected");
    try {
      const amountInSui = amount;
      const amountInMist = suiToMist(amountInSui);

      const coins = await suiClient.getCoins({
        owner: currentWallet.accounts[0].address,
        coinType: "0x2::sui::SUI",
      });

      // Verify ownership and version presence to get valid coins
      const confirmedCoins = await Promise.all(
        coins.data.map(async (coin) => {
          const res: any = await suiClient.getObject({
            id: coin.coinObjectId,
            options: { showOwner: true, showType: true },
          });

          const isValidOwner =
            res.data?.owner?.AddressOwner === currentWallet.accounts[0].address;

          if (!isValidOwner) return null;
          const version = coin.version;
          if (!version || isNaN(Number(version))) {
            console.warn("Skipping coin with invalid version:", coin);
            return null;
          }
          return coin;
        })
      );

      const validCoins = confirmedCoins.filter(Boolean);
      console.log("--validCoins:", validCoins);

      if (!validCoins.length) throw new Error("No valid SUI coins found.");

      const sortedCoins = [...validCoins].sort((a, b) =>
        Number(BigInt(b!.balance) - BigInt(a!.balance))
      );

      let selectedCoins = [];
      let total = 0n;

      for (const coin of sortedCoins) {
        selectedCoins.push(coin);
        total += BigInt(coin!.balance);
        if (total >= amountInMist) break;
      }

      console.log("--Selected Coins:", selectedCoins);
      console.log("--Total Available:", total.toString());

      if (total < amountInMist)
        throw new Error("Insufficient balance to send transaction.");

      const tx = new Transaction();

      if (selectedCoins.length === 1) {
        // no need to set gas if we have single coin
        const [sendCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInMist)]);
        tx.transferObjects([sendCoin], tx.pure.address(recipient));
      } else {
        const sortedByValue = [...selectedCoins].sort((a, b) =>
          Number(BigInt(a!.balance) - BigInt(b!.balance))
        );

        const [gasCoin, ...transferCoins] = sortedByValue;

        if (!transferCoins.length)
          throw new Error("Not enough coins to construct transaction");

        console.log("--gasCoin:", gasCoin);
        console.log("--transferCoins:", transferCoins);

        const coinInputs = transferCoins.map((c) => tx.object(c!.coinObjectId));
        const [mainCoin, ...coinsToMerge] = coinInputs;
        console.log("--coinsToMerge:", transferCoins);
        if (coinsToMerge.length > 0) {
          tx.mergeCoins(mainCoin, coinsToMerge);
        }

        const [sendCoin] = tx.splitCoins(mainCoin, [tx.pure.u64(amountInMist)]);
        tx.transferObjects([sendCoin], tx.pure.address(recipient));

        // Set gas
        tx.setGasPayment([
          {
            objectId: gasCoin!.coinObjectId,
            version: gasCoin!.version,
            digest: gasCoin!.digest,
          },
        ]);
      }

      const result = await signAndExecuteTransaction({
        transaction: tx,
        chain: "sui:testnet",
      });

      await suiClient.waitForTransaction({ digest: (await result).digest });

      console.log("--txn result", result);
      const txnDetails = await suiClient.getTransactionBlock({
        digest: result.digest,
        options: {
          showEffects: true,
          showEvents: false,
          showInput: false,
          showObjectChanges: false,
        },
      });

      if (txnDetails?.effects?.status.status === "success") {
        console.log(
          `--Transaction successful: ${getExplorerUrl(result.digest)}`
        );
        await queryClient.invalidateQueries({ queryKey: ["user-balances"] });
        return result;
      }
      throw new Error("Transaction failed to execute.");
    } catch (error) {
      console.log("--Transaction Error:", error);
      throw new Error((error as Error).message || "Unknown error occurred");
    }
  };

  const mutation = useMutation({
    mutationFn: executeTransaction,
    onSuccess: (result: any) => {
      options?.onSuccess?.(result.digest || "");
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });

  return {
    executeTransaction: mutation.mutate,
    executeTransactionAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
    getExplorerUrl: (txId: string) => getExplorerUrl(txId),
  };
};
