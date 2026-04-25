import { baseApi } from './baseApi';

export const portalApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getDebtorsMaster: builder.query({
      query: body => {
        const formData = new FormData();
        formData.append('company', body.company?.trim()?.toUpperCase());
        formData.append('user_id', body.user_id || '');

        return {
          url: 'portal/debtors_master.php',
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

export const { useGetDebtorsMasterQuery, useLazyGetDebtorsMasterQuery } = portalApi;
