import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { videoService } from '../../services/videoService';

export const fetchVideos = createAsyncThunk(
  'videos/fetchVideos',
  async (params, { rejectWithValue }) => {
    try {
      const response = await videoService.getAllVideos(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchVideoById = createAsyncThunk(
  'videos/fetchVideoById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await videoService.getVideoById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const videoSlice = createSlice({
  name: 'videos',
  initialState: {
    videos: [],
    currentVideo: null,
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    totalVideos: 0
  },
  reducers: {
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload.videos;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalVideos = action.payload.totalVideos;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchVideoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVideo = action.payload.video;
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentVideo, clearError } = videoSlice.actions;
export default videoSlice.reducer;
