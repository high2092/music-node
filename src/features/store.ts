import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { mainSlice } from './mainSlice';
import { modalSlice } from './modalSlice';
import { uiSlice } from './uiSlice';

export const store = configureStore({
  reducer: {
    main: mainSlice.reducer,
    modal: modalSlice.reducer,
    ui: uiSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
