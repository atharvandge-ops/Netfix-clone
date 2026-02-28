import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchService } from '../../services/searchService';

export const searchVideos = createAsyncThunk(
  'search/searchVideos',
  async (params, { rejectWithValue }) => {
    try {
      const response = await searchService.searchVideos(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSuggestions = createAsyncThunk(
  'search/fetchSuggestions',
  async (query, { rejectWithValue }) => {
    try {
      const response = await searchService.getSuggestions(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    results: [],
    suggestions: [],
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1
  },
  reducers: {
    clearResults: (state) => {
      state.results = [];
      state.totalPages = 0;
      state.currentPage = 1;
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.videos;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(searchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload.suggestions;
      });
  }
});

export const { clearResults, clearSuggestions } = searchSlice.actions;
export default searchSlice.reducer;
