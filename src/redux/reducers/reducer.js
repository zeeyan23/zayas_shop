// reducers/reducer.js
import { createSlice } from '@reduxjs/toolkit';

const countSlice = createSlice({
  name: 'count',
  initialState: {
    value: 0,
  },
  
  reducers: {
    updateCount: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { updateCount } = countSlice.actions;
export default countSlice.reducer;
