import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import bookmarkReducer from '../features/bookmarkSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    bookmarks: bookmarkReducer,
  },
});
