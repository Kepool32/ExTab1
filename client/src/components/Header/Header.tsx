import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Logo } from '@assets/icons/Logo';
import { TaskForm } from '@components/TaskForm';
import { useTaskStore } from '@store/taskStore';

export const Header: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const { createTask } = useTaskStore();

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          boxShadow: 3,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar>
            <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }} flex={1}>
              <Logo sx={{ fontSize: { xs: 32, sm: 40 } }} />
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '-0.5px',
                  display: { xs: 'none', sm: 'block' },
                  fontSize: { sm: '1.25rem', md: '1.5rem' },
                }}
              >
                TaskFlow
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setFormOpen(true)}
              sx={{
                backgroundColor: 'white',
                color: '#6366f1',
                fontSize: { xs: '0', sm: '0.875rem', md: '1rem' },
                minWidth: { xs: 40, sm: 'auto' },
                width: { xs: 40, sm: 'auto' },
                height: { xs: 40, sm: 'auto' },
                px: { xs: 1, sm: 2 },
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s',
                '& .MuiButton-startIcon': {
                  margin: { xs: 0, sm: '0 8px 0 -4px' },
                },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                New Task
              </Box>
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      <TaskForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={createTask}
      />
    </>
  );
};
