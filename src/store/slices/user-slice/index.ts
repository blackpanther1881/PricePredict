import { StateCreator } from "zustand";
import { UserInfoSliceState, UserInfoSliceActions } from "./types";

const initialState: UserInfoSliceState = {
  userInfo: { address: "" },
    userBalance: '',
    tokenPrice: '0'

};

export type UserInfoSlice = UserInfoSliceState & UserInfoSliceActions;

export const createUserInfoSlice: StateCreator<UserInfoSlice> = (set) => ({
  ...initialState,
  setUserInfo: (val) =>
    set((state) => ({
      ...state,
      userInfo: val,
    })),
    setUserBalance: (val) =>
        set((state) => ({
            ...state,
            userBalance: val,
        })),
    setTokenPrice: (val) =>
        set((state) => ({
            ...state,
            tokenPrice: val,
        })),
  resetUserSlice: () => set(initialState),
});
