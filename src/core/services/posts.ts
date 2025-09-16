import { api } from '@/core/services/api';

interface PostResponse {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const postsGetApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPosts: build.query<PostResponse[], void>({
      query: () => ({
        url: '/posts',
        method: 'GET',
      }),
      providesTags: (result = []) => [
        ...result.map(({ id }) => ({ type: 'Posts', id }) as const),
        { type: 'Posts' as const, id: 'List' },
      ],
    }),
    getPost: build.query<PostResponse, number>({
      query: (id) => `posts/${id}`,
      providesTags: (_post, _err, id) => [{ type: 'Posts', id }],
    }),
  }),
});

export const { useGetPostsQuery, useGetPostQuery } = postsGetApi;
export const {
  endpoints: { getPosts, getPost },
} = postsGetApi;
