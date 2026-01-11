import { useState, useEffect } from 'react';
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
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Close as CloseIcon } from '@mui/icons-material';
import { Task, UpdateTaskDto } from '@typings/task.types';
import styles from '@components/TaskEditDialog/TaskEditDialog.module.css';

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

interface TaskEditDialogProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSubmit: (id: string, data: UpdateTaskDto) => Promise<void>;
}

export const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
  open,
  task,
  onClose,
  onSubmit,
}) => {
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 600);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (task) {
      setValue('title', task.title);
      setValue('description', task.description || '');
    } else {
      reset();
    }
  }, [task, setValue, reset]);

  const onFormSubmit = async (data: TaskFormData) => {
    if (!task) return;

    setLoading(true);
    try {
      await onSubmit(task.id, {
        title: data.title.trim(),
        description: data.description.trim(),
      });
      handleClose();
    } catch (err) {
      console.error('Error updating task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading && task) {
      setValue('title', task.title);
      setValue('description', task.description || '');
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        className: styles.dialogPaper,
      }}
    >
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <EditIcon color="primary" />
              <Typography variant="h6" className={styles.dialogTitle}>
                Edit Task
              </Typography>
            </Box>
            <IconButton
              onClick={handleClose}
              disabled={loading}
              size="small"
              className={styles.closeButton}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} className={styles.dialogContent}>
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
        <DialogActions className={styles.dialogActions}>
          <Button
            onClick={handleClose}
            disabled={loading}
            fullWidth={isMobile}
            variant="outlined"
            className={styles.button}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !isFormValid()}
            startIcon={<EditIcon />}
            fullWidth={isMobile}
            className={styles.button}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
