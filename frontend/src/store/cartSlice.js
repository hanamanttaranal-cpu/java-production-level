import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axios';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/cart');
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity = 1 }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/cart/add?productId=${productId}&quantity=${quantity}`);
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/cart/item/${itemId}?quantity=${quantity}`);
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (itemId, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`/cart/item/${itemId}`);
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], totalAmount: 0, totalItems: 0, isLoading: false, error: null },
  reducers: {
    clearCart: (state) => { state.items = []; state.totalAmount = 0; state.totalItems = 0; },
  },
  extraReducers: (builder) => {
    const setCart = (state, action) => {
      state.isLoading = false;
      state.items = action.payload?.items || [];
      state.totalAmount = action.payload?.totalAmount || 0;
      state.totalItems = action.payload?.totalItems || 0;
    };
    [fetchCart, addToCart, updateCartItem, removeFromCart].forEach(thunk => {
      builder.addCase(thunk.pending, (state) => { state.isLoading = true; });
      builder.addCase(thunk.fulfilled, setCart);
      builder.addCase(thunk.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
    });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
