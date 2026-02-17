import { baseApi } from './baseApi';
import Toast from 'react-native-toast-message';

/**
 * Auth API endpoints using RTK Query
 * Handles login and authentication-related operations
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => {
        const params = new URLSearchParams();
        params.append('username', credentials.username);
        params.append('password', credentials.password);
        params.append('company', credentials.company);

        return {
          url: 'users.php',
          method: 'POST',
          body: params.toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        };
      },

      transformResponse: (response, meta, arg) => {
        // Transform the API response
        if (response.status === 'true') {
          const user = response.data.find(u => u.user_id === arg.username);
          if (user) {
            return { success: true, user, message: response.message };
          } else {
            throw new Error('User not found in response data');
          }
        } else {
          throw new Error(response.message || 'Login failed');
        }
      },
      transformErrorResponse: (response, meta, arg) => {
        console.log('API Error response:', response);
        return {
          success: false,
          message:
            response?.data?.message ||
            response?.error ||
            'Network error occurred',
          detail: response,
        };
      },
      invalidatesTags: ['Auth', 'User'],
      // Handle side effects
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          Toast.show({
            type: 'success',
            text1: 'Login Successful',
            text2: 'Welcome back!',
          });
        } catch (error) {
          console.error('Login Query Failed:', error);
          Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2:
              error?.error?.message ||
              error?.message ||
              'Please check your credentials and try again.',
          });
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation } = authApi;
