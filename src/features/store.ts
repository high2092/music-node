import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { mainSlice } from './mainSlice';
import { modalSlice } from './modalSlice';
import { uiSlice } from './uiSlice';
import { tutorialSlice } from './tutorialSlice';

export const store = configureStore({
  reducer: {
    main: mainSlice.reducer,
    modal: modalSlice.reducer,
    ui: uiSlice.reducer,
    tutorial: tutorialSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
