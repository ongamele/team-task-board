import { Paper, Stack, Typography } from '@mui/material';

import type { Task } from '../../types';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
    title: string;
    tasks: Task[];
}

export function TaskColumn({ title, tasks }: TaskColumnProps) {
    return (
        <Paper
            variant="outlined"
            sx={{ p: 2, flex: 1, minWidth: 280, bgcolor: 'grey.50' }}
        >
            <Typography variant="h6" gutterBottom>
                {title} ({tasks.length})
            </Typography>
            <Stack>
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
                {tasks.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                        No tasks
                    </Typography>
                )}
            </Stack>
        </Paper>
    );
}
