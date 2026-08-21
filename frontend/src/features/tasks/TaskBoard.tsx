import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    Stack,
    Toolbar,
    Typography,
} from '@mui/material';

import { useGetTasksQuery } from '../../api/apiSlice';
import { useAppSelector } from '../../app/hooks';
import { TaskColumn } from './TaskColumn';
import { TaskFilters } from './TaskFilters';
import { TaskFormDialog } from './TaskFormDialog';
import type { Task, TaskStatus } from '../../types';

const COLUMNS: { status: TaskStatus; title: string }[] = [
    { status: 'todo', title: 'To Do' },
    { status: 'in_progress', title: 'In Progress' },
    { status: 'done', title: 'Done' },
];

export function TaskBoard() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const status = useAppSelector((state) => state.taskFilters.status);
    const assigneeId = useAppSelector(
        (state) => state.taskFilters.assigneeId,
    );

    const { data: tasks = [], isLoading, isError } = useGetTasksQuery({
        status: status === 'all' ? undefined : status,
        assigneeId: assigneeId === 'all' ? undefined : assigneeId,
    });

    const tasksByStatus = (columnStatus: TaskStatus): Task[] =>
        tasks.filter((task) => task.status === columnStatus);

    return (
        <>
            <AppBar position="static" color="primary" enableColorOnDark>
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Team Task Board
                    </Typography>
                    <Button
                        color="inherit"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        aria-label="New task"
                        data-testid="taskboard-header-button-newtask"
                        onClick={() => setIsFormOpen(true)}
                    >
                        New Task
                    </Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <TaskFilters />
                {isLoading && <CircularProgress />}
                {isError && (
                    <Typography color="error">
                        Failed to load tasks. Is the backend running?
                    </Typography>
                )}
                {!isLoading && !isError && (
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        {COLUMNS.map((column) => (
                            <TaskColumn
                                key={column.status}
                                title={column.title}
                                tasks={tasksByStatus(column.status)}
                            />
                        ))}
                    </Stack>
                )}
            </Container>
            <TaskFormDialog
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
            />
        </>
    );
}
