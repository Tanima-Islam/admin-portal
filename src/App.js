import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { ThemeModeProvider } from './theme/ThemeContext'; // ✅ Import Theme Provider

// Components
import Sidebar from './components/Sidebar';

// Pages
import Dashboard from './pages/Dashboard';
import ViewDoctors from './pages/ViewDoctors';
import ManageDoctors from './pages/ManageDoctors';
import NewDoctor from './pages/NewDoctor';
import Specialties from './pages/Specialties';
import Reports from './pages/Reports';
import AddDoctor from './pages/AddDoctor';
import EditDoctor from './pages/EditDoctor';
import ManageUsers from './pages/ManageUsers';

function App() {
  return (
    <ThemeModeProvider>
      <Router>
        <Box
          sx={{
            display: 'flex',
            bgcolor: 'background.default', // ✅ full screen background
            color: 'text.primary',         // ✅ auto text color (light/dark)
            minHeight: '100vh',            // ✅ stretch background
          }}
        >
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/view-doctors" element={<ViewDoctors />} />
              <Route path="/manage-doctors" element={<ManageDoctors />} />
              <Route path="/new-doctor" element={<NewDoctor />} />
              <Route path="/add-doctor" element={<AddDoctor />} />
              <Route path="/edit-doctor/:id" element={<EditDoctor />} />
              <Route path="/specialties" element={<Specialties />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/users" element={<ManageUsers />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeModeProvider>
  );
}

export default App;

