import { createSlice } from '@reduxjs/toolkit';

const tokenSlice = createSlice({
  name: 'username',
  initialState: {
    value: null, // Initially null as no token is available
  },
  
  reducers: {
    updateUsername: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { updateUsername } = tokenSlice.actions;
export default tokenSlice.reducer;