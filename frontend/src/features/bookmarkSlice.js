import { createSlice } from '@reduxjs/toolkit';

export const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState: {
    value: [],
  },
  reducers: {
    setBookmarks: (state, action) => {
      state.value = action.payload;
    },
    addBookmark: (state, action) => {
      const id = action.payload;
      if (!state.value.includes(id)) {
        state.value.push(id);
      }
    },
    removeBookmark: (state, action) => {
      const titleSlugToRemove = action.payload;
      state.value = state.value.filter(q => q.titleSlug !== titleSlugToRemove);
    },
    resetBookmarks: (state) => {
      state.value = [];
    }
  }
});

export const { setBookmarks, addBookmark, removeBookmark, resetBookmarks } = bookmarkSlice.actions;

export const selectBookmarks = (state) => state.bookmarks.value;

export default bookmarkSlice.reducer;
