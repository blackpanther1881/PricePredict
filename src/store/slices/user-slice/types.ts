export interface UserInfo {
  address: any;
}

export interface UserInfoSliceState {
  userInfo: UserInfo;
  userBalance: string,
  tokenPrice: string
}

export interface UserInfoSliceActions {
  setUserInfo: (val: UserInfo) => void;
  setUserBalance: (val: string) => void;
  setTokenPrice: (val: string) => void;
  resetUserSlice: () => void;
}
