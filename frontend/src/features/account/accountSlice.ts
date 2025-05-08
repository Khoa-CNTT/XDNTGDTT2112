// Redux
import { createSlice } from "@reduxjs/toolkit";

// Types
import { Enrollment, User } from "@/types";

export interface AccountState {
  isLoggedIn: boolean;
  user: User | null;
  enrollments: Enrollment[];
}

const initialState: AccountState = {
  isLoggedIn: false,
  user: null,
  enrollments: [],
};

const themeSlice = createSlice({
  name: "theme",
  initialState: initialState,
  reducers: {
    setAccountLoggedIn: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    setAccountLoggedOut: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.enrollments = [];
    },
    setEnrollments: (state, action) => {
      state.enrollments = action.payload;
    },
  },
});

export const { setAccountLoggedIn, setAccountLoggedOut, setEnrollments } =
  themeSlice.actions;
export default themeSlice.reducer;
