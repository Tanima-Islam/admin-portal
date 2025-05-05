import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BarChartIcon from '@mui/icons-material/BarChart';
import CategoryIcon from '@mui/icons-material/Category';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../theme/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Sidebar = () => {
  const navigate = useNavigate();
  const { toggleTheme, mode } = useThemeMode(); // Get current mode

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'View Doctors', icon: <PeopleIcon />, path: '/view-doctors' },
    { text: 'Manage Doctors', icon: <ManageAccountsIcon />, path: '/manage-doctors' },
    { text: 'Specialties', icon: <CategoryIcon />, path: '/specialties' },
    { text: 'Reports', icon: <BarChartIcon />, path: '/reports' },
    { text: 'Manage Users', icon: <PeopleIcon />, path: '/users' },
  ];

  const isDark = mode === 'dark';

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 220,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 220,
          boxSizing: 'border-box',
          backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
          color: isDark ? '#fff' : '#000',
          paddingTop: 2,
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}

        {/* Theme Toggle Button */}
        <ListItem button onClick={toggleTheme}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
          </ListItemIcon>
          <ListItemText primary={isDark ? 'Light Mode' : 'Dark Mode'} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
