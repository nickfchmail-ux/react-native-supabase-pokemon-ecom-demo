import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FavoriteItem = {
  id: string;
  name: string;
  image: string;
  species: string[];
  descriptions: string[];
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  price: number;
  discount: number;
};

type FavoritesState = {
  items: FavoriteItem[];
};

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<FavoriteItem>) {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
