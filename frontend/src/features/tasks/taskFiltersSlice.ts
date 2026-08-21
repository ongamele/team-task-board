import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TaskStatus } from '../../types';

export interface TaskFiltersState {
    status: TaskStatus | 'all';
    assigneeId: string | 'all';
}

const initialState: TaskFiltersState = {
    status: 'all',
    assigneeId: 'all',
};

const taskFiltersSlice = createSlice({
    name: 'taskFilters',
    initialState,
    reducers: {
        statusFilterChanged(state, action: PayloadAction<TaskStatus | 'all'>) {
            state.status = action.payload;
        },
        assigneeFilterChanged(state, action: PayloadAction<string>) {
            state.assigneeId = action.payload;
        },
    },
});

export const { statusFilterChanged, assigneeFilterChanged } =
    taskFiltersSlice.actions;
export const taskFiltersReducer = taskFiltersSlice.reducer;
