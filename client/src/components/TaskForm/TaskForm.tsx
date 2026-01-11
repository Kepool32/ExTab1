import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { CreateTaskDto } from '@typings/task.types';
import styles from '@components/TaskForm/TaskForm.module.css';

const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(255, 'Task title cannot exceed 255 characters')
    .refine((val) => val.trim().length > 0, 'Task title cannot be empty'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description cannot exceed 1000 characters')
    .refine((val) => val.trim().length > 0, 'Description cannot be empty'),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskDto) => Promise<void>;
}

export const TaskForm: React.FC<TaskFormProps> = ({ open, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const titleValue = watch('title');
  const descriptionValue = watch('description');

  const isFormValid = () => {
    const titleTrimmed = titleValue?.trim() || '';
    const descriptionTrimmed = descriptionValue?.trim() || '';
    
    const titleValid = titleTrimmed.length > 0 && titleTrimmed.length <= 255;
    const descriptionValid = descriptionTrimmed.length > 0 && descriptionTrimmed.length <= 1000;
    
    return titleValid && descriptionValid;
  };

  const onFormSubmit = async (data: TaskFormData) => {
    setLoading(true);
    try {
      await onSubmit({
        title: data.title.trim(),
        description: data.description.trim(),
      });
      reset();
      onClose();
    } catch (err) {
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <AddIcon color="primary" />
            <Typography variant="h6">New Task</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              label="Task Title"
              {...register('title')}
              className={styles.textField}
              autoFocus
              error={!!errors.title}
              helperText={errors.title?.message}
              disabled={loading}
              InputLabelProps={{
                required: false,
                classes: {
                  asterisk: styles.textFieldAsterisk,
                },
              }}
              InputProps={{
                classes: {
                  root: styles.textFieldRoot,
                },
              }}
            />
            <TextField
              label="Description"
              {...register('description')}
              className={styles.textField}
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description?.message}
              disabled={loading}
              InputLabelProps={{
                required: false,
                classes: {
                  asterisk: styles.textFieldAsterisk,
                },
              }}
              InputProps={{
                classes: {
                  root: styles.textFieldRoot,
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading} className={styles.button}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !isFormValid()}
            startIcon={<AddIcon />}
            className={styles.button}
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
