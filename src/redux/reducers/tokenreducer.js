import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'token',
  initialState: {
    value: null, // Initially null as no token is available
  },
  
  reducers: {
    updateToken: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { updateToken } = userSlice.actions;
export default userSlice.reducer;