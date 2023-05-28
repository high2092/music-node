import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface UiState {
  showMap: boolean;
}

const initialState: UiState = {
  showMap: true,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setShowMap(state, action: PayloadAction<boolean>) {
      state.showMap = action.payload;
    },
  },
});

export const { setShowMap } = uiSlice.actions;
