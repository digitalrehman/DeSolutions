import { baseApi } from './baseApi';

export const ledgerApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getGLAccountInquiry: builder.mutation({
      queryFn: async (body, api, extraOptions, baseQuery) => {
        const { from_date, to_date, company, account, person_id } = body;

        const state = api.getState();
        const activeCompany = company || state.auth.company;

        const formData = new FormData();
        formData.append('from_date', from_date);
        formData.append('to_date', to_date);
        formData.append('company', activeCompany);
        formData.append('person_id', person_id || '');
        formData.append('account', account || '');

        const result = await baseQuery({
          url: 'ledger/gl_account_inquiry.php',
          method: 'POST',
          body: formData,
        });

        return result.data ? { data: result.data } : { error: result.error };
      },
    }),
    getCustomerAging: builder.mutation({
      queryFn: async (body, api, extraOptions, baseQuery) => {
        const { company, customer_id } = body;

        const state = api.getState();
        const activeCompany = company || state.auth.company;

        const formData = new FormData();
        formData.append('company', activeCompany);
        formData.append('customer_id', customer_id);

        const result = await baseQuery({
          url: 'ledger/customer_aging.php',
          method: 'POST',
          body: formData,
        });

        return result.data ? { data: result.data } : { error: result.error };
      },
    }),
    getCustomerBalanceDetails: builder.mutation({
      queryFn: async (body, api, extraOptions, baseQuery) => {
        const { company, customer_id, from_date, to_date } = body;

        const state = api.getState();
        const activeCompany = company || state.auth.company;

        const formData = new FormData();
        formData.append('company', activeCompany);
        formData.append('customer_id', customer_id);
        formData.append('from_date', from_date);
        formData.append('to_date', to_date);

        const result = await baseQuery({
          url: 'ledger/customer_balance_details.php',
          method: 'POST',
          body: formData,
        });

        return result.data ? { data: result.data } : { error: result.error };
      },
    }),
  }),
  overrideExisting: true,
});

export const { useGetGLAccountInquiryMutation, useGetCustomerAgingMutation, useGetCustomerBalanceDetailsMutation } = ledgerApi;
