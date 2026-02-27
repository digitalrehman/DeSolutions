import { baseApi } from './baseApi';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getIncomeExpense: builder.mutation({
      query: body => {
        const formData = new FormData();
        formData.append('from_date', body.from_date);
        formData.append('to_date', body.to_date);
        formData.append('company', body.company);

        return {
          url: 'dashboard/income_and_expense.php',
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      },
    }),
    getParentAccountDetail: builder.mutation({
      async queryFn(body, queryApi, _extraOptions, baseQuery) {
        const state = queryApi.getState();
        const company = body.company || state.auth.company;

        const formData = new FormData();
        formData.append('from_date', body.from_date);
        formData.append('to_date', body.to_date);
        formData.append('account_type', body.account_type);
        formData.append('company', company);

        const result = await baseQuery({
          url: '/dashboard/parent_account_detail.php',
          method: 'POST',
          body: formData,
        });

        return result.data ? { data: result.data } : { error: result.error };
      },
    }),
    getFinancialOverview: builder.query({
      async queryFn(_arg, queryApi, _extraOptions, baseQuery) {
        // According to the user, this is a GET request: /dashboard/financial_overview.php
        const result = await baseQuery({
          url: '/dashboard/financial_overview.php',
          method: 'GET',
        });
        return result.data ? { data: result.data } : { error: result.error };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetIncomeExpenseMutation,
  useGetParentAccountDetailMutation,
  useGetFinancialOverviewQuery,
} = dashboardApi;
