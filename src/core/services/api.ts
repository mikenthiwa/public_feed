import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { Action, PayloadAction } from '@reduxjs/toolkit';

type RootState = never;

function isHydrateAction(action: Action): action is PayloadAction<RootState> {
  return action.type === HYDRATE;
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: (headers) => {
    headers.set('Content-type', 'application/json; charset=UTF-8');
  },
});

const baseQueryWithRetry = retry(baseQuery);

const extractRehydrationInfo = (action: Action, { reducerPath }: { reducerPath: never }) => {
  if (isHydrateAction(action)) {
    return action.payload[reducerPath];
  }
};

export const api = createApi({
  // reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
  extractRehydrationInfo,
  tagTypes: ['Posts'],
  endpoints: () => ({}),
});
