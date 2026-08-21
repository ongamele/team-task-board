import { MenuItem, Stack, TextField } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useGetUsersQuery } from '../../api/apiSlice';
import {
    assigneeFilterChanged,
    statusFilterChanged,
} from './taskFiltersSlice';
import type { TaskStatus } from '../../types';

const STATUS_OPTIONS: { value: TaskStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All statuses' },
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
];

export function TaskFilters() {
    const dispatch = useAppDispatch();
    const status = useAppSelector((state) => state.taskFilters.status);
    const assigneeId = useAppSelector(
        (state) => state.taskFilters.assigneeId,
    );
    const { data: users = [] } = useGetUsersQuery();

    return (
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <TextField
                select
                label="Status"
                aria-label="Filter by status"
                value={status}
                onChange={(event) =>
                    dispatch(
                        statusFilterChanged(
                            event.target.value as TaskStatus | 'all',
                        ),
                    )
                }
                sx={{ minWidth: 180 }}
                data-testid="taskboard-select-statusfilter"
                slotProps={{
                    htmlInput: { 'aria-label': 'Filter by status' },
                }}
            >
                {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                select
                label="Assignee"
                aria-label="Filter by assignee"
                value={assigneeId}
                onChange={(event) =>
                    dispatch(assigneeFilterChanged(event.target.value))
                }
                sx={{ minWidth: 180 }}
                data-testid="taskboard-select-assigneefilter"
                slotProps={{
                    htmlInput: { 'aria-label': 'Filter by assignee' },
                }}
            >
                <MenuItem value="all">All assignees</MenuItem>
                {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                        {user.name}
                    </MenuItem>
                ))}
            </TextField>
        </Stack>
    );
}
