import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axios';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products', { params });
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchProductById = createAsyncThunk('products/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/products/${id}`);
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const searchProducts = createAsyncThunk('products/search', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/search', { params });
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchFeatured = createAsyncThunk('products/featured', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/featured');
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [], featured: [], selectedProduct: null,
    totalPages: 0, currentPage: 0, totalElements: 0,
    isLoading: false, error: null, searchResults: [],
  },
  reducers: { clearSelected: (state) => { state.selectedProduct = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.isLoading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.selectedProduct = action.payload; })
      .addCase(fetchFeatured.fulfilled, (state, action) => { state.featured = action.payload; })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.content;
        state.totalPages = action.payload.totalPages;
      });
  },
});

export const { clearSelected } = productSlice.actions;
export default productSlice.reducer;
