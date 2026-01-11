import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  Paper,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  Task as TaskIcon,
} from '@mui/icons-material';
import { Task } from '@typings/task.types';
import { TaskCard } from '@components/TaskCard';
import { TaskEditDialog } from '@components/TaskEditDialog';
import { Loader } from '@components/Loader';
import { useTaskStore } from '@store/taskStore';
import { filterTasks, paginateTasks, getTotalPages } from '@utils/pagination';
import { debounce } from '@utils/debounce';
import { useInput } from '@hooks/useInput';
import styles from '@components/TaskList/TaskList.module.css';

export const TaskList: React.FC = () => {
  const {
    tasks,
    loading,
    searchQuery,
    currentPage,
    itemsPerPage,
    fetchTasks,
    updateTask,
    updateTaskData,
    deleteTask,
    setSearchQuery,
    setCurrentPage,
  } = useTaskStore();

  const searchInput = useInput(searchQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const previousSearchQueryRef = useRef<string>(searchQuery);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (searchQuery !== previousSearchQueryRef.current) {
      searchInput.setValue(searchQuery);
      previousSearchQueryRef.current = searchQuery;
    }
  }, [searchQuery, searchInput.setValue]);

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setSearchQuery(query);
        setIsSearching(false);
      }, 1000),
    [setSearchQuery]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      searchInput.setValue(value);
      if (value.trim() === '') {
        setSearchQuery('');
        setIsSearching(false);
      } else {
        setIsSearching(true);
        debouncedSearch(value);
      }
    },
    [debouncedSearch, setSearchQuery, searchInput]
  );

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
    setEditingTask(null);
  }, []);

  const handleUpdateTask = useCallback(
    async (
      id: string,
      data: { title?: string; description?: string; completed?: boolean }
    ) => {
      await updateTaskData(id, data);
    },
    [updateTaskData]
  );

  const handlePageChange = useCallback(
    (_: React.ChangeEvent<unknown>, page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  const filteredTasks = useMemo(
    () => filterTasks(tasks, searchQuery),
    [tasks, searchQuery]
  );

  const paginatedTasks = useMemo(
    () => paginateTasks(filteredTasks, currentPage, itemsPerPage),
    [filteredTasks, currentPage, itemsPerPage]
  );

  const totalPages = useMemo(
    () => getTotalPages(filteredTasks, itemsPerPage),
    [filteredTasks, itemsPerPage]
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ width: '100%', px: { xs: 0.5, sm: 1, md: 0 } }}>
      <Paper className={styles.searchPaper}>
        <TextField
          fullWidth
          placeholder="Search tasks..."
          value={searchInput.value}
          onChange={(e) => handleSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputBase-root': {
              fontSize: { xs: '0.8125rem', sm: '0.9375rem', md: '1rem' },
              height: { xs: 40, sm: 48 },
            },
          }}
        />
      </Paper>

      {isSearching ? (
        <Loader />
      ) : filteredTasks.length === 0 ? (
        <Paper sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center', borderRadius: { xs: '8px', sm: '12px' } }}>
          <TaskIcon sx={{ fontSize: { xs: 40, sm: 56, md: 64 }, color: 'text.secondary', mb: 2 }} />
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
              fontWeight: { xs: 500, sm: 600 },
            }}
          >
            No tasks
          </Typography>
        </Paper>
      ) : (
        <>
          <Stack spacing={{ xs: 1.5, sm: 2 }}>
            {paginatedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={updateTask}
                onEdit={handleEditTask}
                onDelete={deleteTask}
              />
            ))}
          </Stack>

          <TaskEditDialog
            open={isEditDialogOpen}
            task={editingTask}
            onClose={handleCloseEditDialog}
            onSubmit={handleUpdateTask}
          />

          {filteredTasks.length > 0 && (
            <Box className={styles.paginationContainer}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="small"
                shape="rounded"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                    minWidth: { xs: 32, sm: 36, md: 40 },
                    height: { xs: 32, sm: 36, md: 40 },
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    },
                  },
                  '& .Mui-selected': {
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                    },
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
