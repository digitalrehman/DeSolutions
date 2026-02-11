import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Auth Slice - Manages authentication state
 */
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      // Persist to AsyncStorage
      AsyncStorage.setItem('user', JSON.stringify(user));
      if (token) {
        AsyncStorage.setItem('token', token);
      }
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Clear AsyncStorage
      AsyncStorage.removeItem('user');
      AsyncStorage.removeItem('token');
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    restoreSession: (state, action) => {
      const { user, token } = action.payload;
      if (user) {
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
      }
    },
  },
});

export const { setCredentials, logout, setLoading, restoreSession } =
  authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = state => state.auth.user;
export const selectIsAuthenticated = state => state.auth.isAuthenticated;
export const selectAuthLoading = state => state.auth.isLoading;
