import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { createUserInfoSlice, UserInfoSlice } from "./slices/user-slice";
import { devtools, persist } from "zustand/middleware";

type StoreState = UserInfoSlice ;

export const useAppStore = createWithEqualityFn<StoreState>()(
  persist(
    devtools((...a) => ({
      ...createUserInfoSlice(...a),
    })),
    {
      name: "user-store",
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) =>
              key !== "inProgressMintingList" &&
              typeof state[key as keyof StoreState] !== "function"
          )
        ),
    }
  ),
  shallow
);
