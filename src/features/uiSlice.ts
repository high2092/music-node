import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface UiState {
  showMap: boolean;
  isConnecting: boolean;
  mounted: boolean;
  inProgress: boolean;
}

const initialState: UiState = {
  showMap: true,
  isConnecting: false,
  mounted: false,
  inProgress: false,
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
    setMounted(state, action: PayloadAction<boolean>) {
      state.mounted = action.payload;
    },
    setInProgress(state, action: PayloadAction<boolean>) {
      state.inProgress = action.payload;
    },
  },
});

export const { setShowMap, setIsConnecting, setMounted, setInProgress } = uiSlice.actions;
