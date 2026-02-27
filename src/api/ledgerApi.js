import { baseApi } from './baseApi';

export const ledgerApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getGLAccountInquiry: builder.mutation({
      queryFn: async (body, api, extraOptions, baseQuery) => {
        const { from_date, to_date, company, account } = body;

        // Use provided values or default to state/1 month range
        const state = api.getState();
        const activeCompany = company || state.auth.company;

        const formData = new FormData();
        formData.append('from_date', from_date);
        formData.append('to_date', to_date);
        formData.append('company', activeCompany);
        formData.append('account', account);

        const result = await baseQuery({
          url: 'ledger/gl_account_inquiry.php',
          method: 'POST',
          body: formData,
        });

        return result.data ? { data: result.data } : { error: result.error };
      },
    }),
  }),
  overrideExisting: true,
});

export const { useGetGLAccountInquiryMutation } = ledgerApi;
