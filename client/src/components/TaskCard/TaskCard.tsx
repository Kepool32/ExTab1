import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  IconButton,
  Box,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { Task } from '@typings/task.types';
import styles from '@components/TaskCard/TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const timeAgo = formatDistanceToNow(new Date(task.createdAt), {
    addSuffix: true,
    locale: enUS,
  });

  return (
    <Card
      className={`${styles.taskCard} ${task.completed ? styles.taskCardCompleted : ''} ${styles.taskCardBorder} ${task.completed ? styles.taskCardBorderCompleted : ''}`}
      sx={{
        mb: { xs: 1.5, sm: 2 },
      }}
    >
      <CardContent sx={{ p: { xs: 1.5, sm: 2.5 }, '&:last-child': { pb: { xs: 1.5, sm: 2.5 } } }}>
        <Box
          display="flex"
          alignItems="flex-start"
          gap={{ xs: 1, sm: 1.5 }}
          flexDirection={{ xs: 'column', sm: 'row' }}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            width={{ xs: '100%', sm: 'auto' }}
            justifyContent={{ xs: 'space-between', sm: 'flex-start' }}
          >
            <Checkbox
              checked={task.completed}
              onChange={(e) => {
                e.stopPropagation();
                onToggle(task.id, e.target.checked);
              }}
              icon={<UncheckedIcon sx={{ color: '#6366f1', fontSize: { xs: 20, sm: 24 } }} />}
              checkedIcon={<CheckCircleIcon sx={{ color: '#10b981', fontSize: { xs: 20, sm: 24 } }} />}
              size="small"
              sx={{
                mt: { xs: 0, sm: -1 },
                p: { xs: 0.5, sm: 1 },
              }}
            />

            <Box
              display="flex"
              flexDirection="row"
              gap={0.5}
              sx={{
                display: { xs: 'flex', sm: 'none' },
              }}
            >
              <Tooltip title="Edit">
                <IconButton
                  onClick={() => onEdit(task)}
                  color="primary"
                  size="small"
                  className={styles.iconButtonEdit}
                  sx={{
                    p: 0.75,
                  }}
                >
                  <EditIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  onClick={() => onDelete(task.id)}
                  color="error"
                  size="small"
                  className={styles.iconButtonDelete}
                  sx={{
                    p: 0.75,
                  }}
                >
                  <DeleteIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box flex={1} width="100%" minWidth={0}>
            <Typography
              variant="h6"
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'text.secondary' : 'text.primary',
                mb: { xs: 0.5, sm: 0.75 },
                fontWeight: { xs: 600, sm: 700 },
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                lineHeight: { xs: 1.4, sm: 1.5 },
                wordBreak: 'break-word',
              }}
            >
              {task.title}
            </Typography>

            {task.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: { xs: 1, sm: 1.5 },
                  textDecoration: task.completed ? 'line-through' : 'none',
                  fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                  lineHeight: 1.5,
                  wordBreak: 'break-word',
                }}
              >
                {task.description}
              </Typography>
            )}

            <Box
              display="flex"
              alignItems="center"
              gap={0.75}
              flexWrap="wrap"
            >
              <Chip
                label={timeAgo}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: { xs: '0.625rem', sm: '0.6875rem' },
                  height: { xs: 20, sm: 24 },
                  '& .MuiChip-label': {
                    px: { xs: 1, sm: 1.25 },
                  },
                }}
              />
              {task.completed && (
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />}
                  label="Completed"
                  color="success"
                  size="small"
                  sx={{
                    fontSize: { xs: '0.625rem', sm: '0.6875rem' },
                    height: { xs: 20, sm: 24 },
                    '& .MuiChip-label': {
                      px: { xs: 1, sm: 1.25 },
                    },
                  }}
                />
              )}
            </Box>
          </Box>

          <Box
            display={{ xs: 'none', sm: 'flex' }}
            flexDirection="row"
            gap={0.5}
            sx={{
              alignItems: 'center',
              mt: { xs: 0, sm: -1 },
            }}
          >
            <Tooltip title="Edit">
              <IconButton
                onClick={() => onEdit(task)}
                color="primary"
                size="small"
                className={styles.iconButtonEdit}
                sx={{
                  p: 1,
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <EditIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                onClick={() => onDelete(task.id)}
                color="error"
                size="small"
                className={styles.iconButtonDelete}
                sx={{
                  p: 1,
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <DeleteIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
