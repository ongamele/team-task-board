import DeleteIcon from '@mui/icons-material/Delete';
import {
    Card,
    CardContent,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

import {
    useDeleteTaskMutation,
    useUpdateTaskStatusMutation,
} from '../../api/apiSlice';
import type { Task, TaskStatus } from '../../types';

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
];

interface TaskCardProps {
    task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
    const [updateStatus] = useUpdateTaskStatusMutation();
    const [deleteTask] = useDeleteTaskMutation();

    return (
        <Card
            variant="outlined"
            sx={{ mb: 2 }}
            data-testid={`taskcard-${task.id}-container`}
        >
            <CardContent>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                >
                    <Typography variant="subtitle1" fontWeight={600}>
                        {task.title}
                    </Typography>
                    <IconButton
                        size="small"
                        aria-label="Delete task"
                        data-testid={`taskcard-${task.id}-button-delete`}
                        onClick={() => deleteTask(task.id)}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
                {task.description && (
                    <Typography variant="body2" color="text.secondary">
                        {task.description}
                    </Typography>
                )}
                <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mt: 1 }}
                >
                    {task.assignee ? task.assignee.name : 'Unassigned'}
                </Typography>
                <TextField
                    select
                    size="small"
                    value={task.status}
                    aria-label="Task status"
                    onChange={(event) =>
                        updateStatus({
                            id: task.id,
                            status: event.target.value as TaskStatus,
                        })
                    }
                    sx={{ mt: 1, minWidth: 150 }}
                    data-testid={`taskcard-${task.id}-select-status`}
                    slotProps={{
                        htmlInput: { 'aria-label': 'Task status' },
                    }}
                >
                    {STATUS_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </CardContent>
        </Card>
    );
}
