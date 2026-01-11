import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export const Loader: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="400px"
      gap={3}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
        }}
      >
        <CircularProgress
          size={70}
          thickness={4}
          sx={{
            color: '#6366f1',
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress
            variant="determinate"
            value={25}
            size={70}
            thickness={4}
            sx={{
              color: '#8b5cf6',
              transform: 'rotate(-90deg)',
            }}
          />
        </Box>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
        Loading...
      </Typography>
    </Box>
  );
};
