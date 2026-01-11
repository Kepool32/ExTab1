import { Box, Container, CssBaseline } from '@mui/material';
import { Header } from '@components/Header';
import { TaskList } from '@components/TaskList';
import { usePreventCopy } from '@hooks/usePreventCopy';

function App() {
  usePreventCopy();

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        }}
      >
        <Header />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <TaskList />
        </Container>
      </Box>
    </>
  );
}

export default App;
