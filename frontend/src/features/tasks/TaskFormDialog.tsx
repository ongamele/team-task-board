import { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Stack,
    TextField,
} from '@mui/material';

import { useCreateTaskMutation } from '../../api/apiSlice';
import { useGetUsersQuery } from '../../api/apiSlice';

interface TaskFormDialogProps {
    open: boolean;
    onClose: () => void;
}

export function TaskFormDialog({ open, onClose }: TaskFormDialogProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assigneeId, setAssigneeId] = useState('');
    const [createTask, { isLoading }] = useCreateTaskMutation();
    const { data: users = [] } = useGetUsersQuery();

    const resetAndClose = () => {
        setTitle('');
        setDescription('');
        setAssigneeId('');
        onClose();
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            return;
        }

        await createTask({
            title: title.trim(),
            description: description.trim() || undefined,
            assigneeId: assigneeId || undefined,
        }).unwrap();

        resetAndClose();
    };

    return (
        <Dialog
            open={open}
            onClose={resetAndClose}
            fullWidth
            maxWidth="sm"
            data-testid="taskboard-dialog-createtask"
        >
            <DialogTitle>New Task</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Title"
                        aria-label="Title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                        autoFocus
                        data-testid="taskform-textfield-title"
                        slotProps={{ htmlInput: { 'aria-label': 'Title' } }}
                    />
                    <TextField
                        label="Description"
                        aria-label="Description"
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                        multiline
                        minRows={2}
                        data-testid="taskform-textfield-description"
                        slotProps={{
                            htmlInput: { 'aria-label': 'Description' },
                        }}
                    />
                    <TextField
                        select
                        label="Assignee"
                        aria-label="Assignee"
                        value={assigneeId}
                        onChange={(event) => setAssigneeId(event.target.value)}
                        data-testid="taskform-select-assignee"
                        slotProps={{
                            htmlInput: { 'aria-label': 'Assignee' },
                        }}
                    >
                        <MenuItem value="">Unassigned</MenuItem>
                        {users.map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                                {user.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={resetAndClose}
                    aria-label="Cancel"
                    data-testid="taskform-button-cancel"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!title.trim() || isLoading}
                    aria-label="Create task"
                    data-testid="taskform-button-create"
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}
