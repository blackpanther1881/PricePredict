import { StateCreator } from "zustand";
import { UserInfoSliceState, UserInfoSliceActions } from "./types";

const initialState: UserInfoSliceState = {
  userInfo: { address: "" },
};

export type UserInfoSlice = UserInfoSliceState & UserInfoSliceActions;

export const createUserInfoSlice: StateCreator<UserInfoSlice> = (set) => ({
  ...initialState,
  setUserInfo: (val) =>
    set((state) => ({
      ...state,
      userInfo: val,
    })),
  resetUserSlice: () => set(initialState),
});
