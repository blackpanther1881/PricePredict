import { useQuery } from "@tanstack/react-query";

export const usePricesQuery = () => {
  return useQuery({
    queryKey: ["prices"],
    queryFn: async () => {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/sui`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      const sui = data.market_data.current_price.usd;
      return {
        sui,
      };
    },
    enabled: true,
    refetchInterval:3000,
    refetchOnWindowFocus: false,
  });
};
