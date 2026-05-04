import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@env';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  tagTypes: ['User', 'Auth', 'Dashboard', 'Dimension'],
  keepUnusedDataFor: 600, // 10 minutes cache
  endpoints: builder => ({
    getFunctionalityCheck: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append('company', body.company);
        
        return {
          url: 'access/functionality_checks.php',
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      },
    }),
    getDimensionDropdown: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append('company', body.company);
        
        return {
          url: 'dropdown/dimension1.php',
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      },
    }),
    getStockMasterDropdown: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append('company', body.company);
        
        return {
          url: 'dropdown/stock_master.php',
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      },
    }),
    getSalesCategory: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append('company', 'CRM');
        
        return {
          url: 'dropdown/sales_category.php',
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      },
    }),
    getSalesActivity: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append('company', 'CRM');
        formData.append('sales_category', body.sales_category);
        
        return {
          url: 'dropdown/sales_activity.php',
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      },
    }),
    getHospital: builder.mutation({
      query: () => {
        const formData = new FormData();
        formData.append('company', 'CRM');
        
        return {
          url: 'dropdown/hospital.php',
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      },
      transformResponse: (response) => {
        if (response.status === 'true' && Array.isArray(response.data)) {
          return {
            ...response,
            data: response.data.map(item => ({
              ...item,
              name: (item.name || '').replace(/&amp;/g, '&'),
            })),
          };
        }
        return response;
      },
    }),
    getHospitalContacts: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append('company', 'CRM');
        formData.append('hospital_id', body.hospital_id);
        
        return {
          url: 'dropdown/hospital_contacts.php',
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      },
    }),
    getDailyWorkingPlan: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append('company', 'CRM');
        formData.append('user_id', body.user_id);
        formData.append('date', body.date);
        
        return {
          url: 'portal/get_daily_working_plan.php',
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      },
    }),
    addDailyWorkingPlan: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append('company', 'CRM');
        formData.append('id', body.id || '0');
        formData.append('user_id', body.user_id);
        formData.append('activity_date', body.activity_date);
        formData.append('category', body.category);
        formData.append('activity', body.activity); // Name from dropdown
        formData.append('activity_id', body.activity_id); // New field: ID from dropdown
        formData.append('hospital_name', body.hospital_name);
        formData.append('contact_person', body.contact_person);
        formData.append('progress_status', body.progress_status || '1');
        formData.append('created_by', body.created_by);
        formData.append('evening_remarks', body.evening_remarks || '');
        if (body.emp_code) formData.append('emp_code', body.emp_code);
        
        return {
          url: 'portal/daily_working_plan.php',
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      },
    }),
    getSalesProgressStatus: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append('company', 'CRM');
        formData.append('activity', body.activity);
        
        return {
          url: 'dropdown/sales_activity_progress_status.php',
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      },
    }),
    toggleErpStatus: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append('company', body.company);
        formData.append('activate', body.activate);
        
        return {
          url: 'access/erp_on_off.php',
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      },
    }),
  }),
});

export const { 
  useGetFunctionalityCheckMutation, 
  useGetDimensionDropdownMutation, 
  useGetStockMasterDropdownMutation, 
  useGetSalesCategoryMutation,
  useGetSalesActivityMutation,
  useGetHospitalMutation,
  useGetHospitalContactsMutation,
  useGetDailyWorkingPlanMutation,
  useAddDailyWorkingPlanMutation,
  useGetSalesProgressStatusMutation,
  useToggleErpStatusMutation 
} = baseApi;

export default baseApi;
