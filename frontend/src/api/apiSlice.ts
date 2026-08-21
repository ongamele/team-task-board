import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type {
    CreateTaskInput,
    Task,
    TaskFilters,
    TaskStatus,
    User,
} from '../types';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3333';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
    tagTypes: ['Task', 'User'],
    endpoints: (builder) => ({
        getUsers: builder.query<User[], void>({
            query: () => '/users',
            providesTags: ['User'],
        }),
        getTasks: builder.query<Task[], TaskFilters | void>({
            query: (filters) => ({
                url: '/tasks',
                params: filters ?? undefined,
            }),
            providesTags: ['Task'],
        }),
        createTask: builder.mutation<Task, CreateTaskInput>({
            query: (body) => ({
                url: '/tasks',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Task'],
        }),
        updateTaskStatus: builder.mutation<
            Task,
            { id: string; status: TaskStatus }
        >({
            query: ({ id, status }) => ({
                url: `/tasks/${id}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Task'],
        }),
        deleteTask: builder.mutation<void, string>({
            query: (id) => ({
                url: `/tasks/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Task'],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskStatusMutation,
    useDeleteTaskMutation,
} = apiSlice;
