import { createSlice } from '@reduxjs/toolkit';

const onlineTrackerSlice = createSlice({
  name: 'online-tracker',
  initialState: { online: 0 },
  reducers: {
    setOnlineUser: (state, action) => {
      state.online = action.payload;
    },
  },
});

export const { setOnlineUser } = onlineTrackerSlice.actions;
export default onlineTrackerSlice.reducer;
