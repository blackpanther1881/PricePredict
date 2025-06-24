import { MIST_PER_SUI, SUI_DECIMALS } from "@mysten/sui/utils";

// To convert given number to short format Ex: 100000 -> 100K
export const numberFormat = (number: any, decPlaces: number) => {
  decPlaces = Math.pow(10, decPlaces);
  const abbrev = ["K", "M", "M", "T"];
  for (let i = abbrev.length - 1; i >= 0; i--) {
    const size = Math.pow(10, (i + 1) * 3);
    if (size <= number) {
      number = Math.round((number * decPlaces) / size) / decPlaces;
      if (number == 1000 && i < abbrev.length - 1) {
        number = 1;
        i++;
      }
      number += abbrev[i];
      break;
    }
  }
  return number;
};

export const mistToSui = (mist: number | string | bigint): string => {
  return (BigInt(mist) / BigInt(MIST_PER_SUI)).toString();
};

export const mistToSuiDecimal = (mist: number | string | bigint): string => {
  return (Number(mist) / 10 ** 9).toString();
};

export const suiToMist = (sui: number | string): bigint => {
  const [whole = "0", fraction = ""] = String(sui).split(".");
  const paddedFraction = (fraction + "0".repeat(9)).slice(0, 9);
  const wholeMist = BigInt(whole) * MIST_PER_SUI;
  const fractionMist = BigInt(paddedFraction);
  return wholeMist + fractionMist;
};
