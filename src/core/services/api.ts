import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
});

const baseQueryWithRetry = retry(baseQuery);

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Posts'],
  endpoints: () => ({}),
});
