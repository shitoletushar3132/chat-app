import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  name: "",
  email: "",
  profile_pic: "",
  token: "",
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state._id = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profile_pic = action.payload.profile_pic;
    },
    setToken: (state, action) => {
      if (action.payload && action.payload.token) {
        state.token = action.payload.token;
      } else {
        console.error(
          "setToken action payload is undefined or does not contain a token property"
        );
      }
    },

    logout: (state, action) => {
      state._id = "";
      state.name = "";
      state.email = "";
      state.profile_pic = "";
      state.token = "";
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setToken, logout } = userSlice.actions;

export default userSlice.reducer;
