import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface UiState {
  showMap: boolean;
  isConnecting: boolean;
}

const initialState: UiState = {
  showMap: true,
  isConnecting: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setShowMap(state, action: PayloadAction<boolean>) {
      state.showMap = action.payload;
    },
    setIsConnecting(state, action: PayloadAction<boolean>) {
      state.isConnecting = action.payload;
    },
  },
});

export const { setShowMap, setIsConnecting } = uiSlice.actions;
