export interface UserInfo {
  address: any;
}

export interface UserInfoSliceState {
  userInfo: UserInfo;
}

export interface UserInfoSliceActions {
  setUserInfo: (val: UserInfo) => void;
  resetUserSlice: () => void;
}
