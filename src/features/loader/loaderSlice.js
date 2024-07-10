import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: false
};

export const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    setLoader: (state, action) => {
      state.value = action.payload
    },
  },
});

export const { setLoader } = loaderSlice.actions;

export const isLoader = (state) => state.loader.value;

export default loaderSlice.reducer;