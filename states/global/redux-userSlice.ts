import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { id: '', location: '' },
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.location = action.payload.location;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
