import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './redux-cartSlice';
import favoritesSlice from './redux-favoritesSlice';
import locationSlice from './redux-locationSlice';
import onlineUserSlice from './redux-onlineUserSlice';
import userSlice from './redux-userSlice';
export const store = configureStore({
  reducer: {
    user: userSlice,
    onlineUser: onlineUserSlice,
    location: locationSlice,
    cart: cartSlice,
    favorites: favoritesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
