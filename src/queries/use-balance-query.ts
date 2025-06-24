import { useQuery } from "@tanstack/react-query";
import { useSuiClient } from "@mysten/dapp-kit";

export const useGetUserBalance = ({ account }: { account: string }) => {
  const suiClient = useSuiClient();
  return useQuery({
    queryKey: ["user-balances", account],
    queryFn: async () => {
      try {
        const balance = await suiClient.getBalance({
          owner: account,
          coinType: "0x2::sui::SUI",
        });
        return balance.totalBalance;
      } catch (error: any) {
        return "0";
      }
    },
    enabled: account !== "",
    refetchOnWindowFocus: false,
  });
};
