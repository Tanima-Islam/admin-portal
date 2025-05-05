import React from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeMode } from '../theme/ThemeContext'; // ✅ Import

function Dashboard() {
  const { toggleTheme, mode } = useThemeMode(); // ✅ Use theme context

  return (
    <Box sx={{ padding: 4 }}>
      {/* Top row with welcome + toggle button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">
          Welcome, Base 👋
        </Typography>

        <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
          <IconButton onClick={toggleTheme}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
        <Typography variant="h6">About This Portal</Typography>
        <Typography variant="body2" sx={{ marginTop: 1 }}>
          This admin portal allows you to:
          <ul>
            <li>View total number of doctors</li>
            <li>Track doctor activity</li>
            <li>Register and manage doctors</li>
            <li>Generate insightful reports</li>
          </ul>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Dashboard;
