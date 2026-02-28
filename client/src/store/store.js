import { configureStore } from '@reduxjs/toolkit';
import videoReducer from './slices/videoSlice';
import searchReducer from './slices/searchSlice';

export const store = configureStore({
  reducer: {
    videos: videoReducer,
    search: searchReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
