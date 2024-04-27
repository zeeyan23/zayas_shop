import { createSlice } from '@reduxjs/toolkit';

const idSlice = createSlice({
  name: 'Id',
  initialState: {
    value: null, // Initially null as no token is available
  },
  
  reducers: {
    updateId: (state, action) => {
      state.value = action.payload;
    },
    
  },
});

export const { updateId } = idSlice.actions;
export default idSlice.reducer;