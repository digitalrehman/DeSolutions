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
  }),
  overrideExisting: true,
});

export const { useGetIncomeExpenseMutation } = dashboardApi;
