import { SUI_NETWORKS } from "./config";

export const getExplorerUrl = (
  txId: string,
  network: keyof typeof SUI_NETWORKS = "testnet"
): string => {
  const baseUrl =
    network === "mainnet"
      ? "https://testnet.suivision.xyz/txblock"
      : "https://testnet.suivision.xyz/txblock";
  return `${baseUrl}/${txId}`;
};

export const getExplorerBaseUrl = (
  network: keyof typeof SUI_NETWORKS = "testnet"
): string => {
  return network === "mainnet"
    ? "https://suiscan.xyz/mainnet"
    : "https://suiscan.xyz/testnet";
};

export const stringTruncate = (str: string, length = 7): string => {
  if (str.length > 30) {
    return (
      str.substring(0, length) +
      "..." +
      str.substring(str.length - length, str.length)
    );
  }
  return str;
};
