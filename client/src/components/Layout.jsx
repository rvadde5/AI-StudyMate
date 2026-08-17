import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  alpha,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Chat,
  MenuBook,
  Quiz,
  Person,
  Info,
  AdminPanelSettings,
  Logout,
  Brightness4,
  Brightness7,
  Style,
  AutoStories,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

const drawerWidth = 280;

const navItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', mobileLabel: 'Home' },
  { text: 'AI Chat', icon: <Chat />, path: '/chat', mobileLabel: 'Chat' },
  { text: 'Materials', icon: <MenuBook />, path: '/materials', mobileLabel: 'Notes' },
  { text: 'Quiz', icon: <Quiz />, path: '/quiz', mobileLabel: 'Quiz' },
  { text: 'Flashcards', icon: <Style />, path: '/flashcards', mobileLabel: 'Cards' },
  { text: 'Profile', icon: <Person />, path: '/profile', mobileLabel: 'Profile' },
];

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { darkMode, toggleDarkMode } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNav = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 2.5,
          background: `linear-gradient(135deg, ${alpha('#6366f1', 0.12)} 0%, ${alpha('#8b5cf6', 0.08)} 100%)`,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#fff',
            }}
          >
            <AutoStories fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={800} lineHeight={1.2}>
              AI StudyMate
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Premium Learning
            </Typography>
          </Box>
        </Box>
      </Box>

      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNav(item.path)}
              aria-current={location.pathname === item.path ? 'page' : undefined}
            >
              <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 700 : 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        {isAdmin && (
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === '/admin'}
              onClick={() => handleNav('/admin')}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AdminPanelSettings />
              </ListItemIcon>
              <ListItemText primary="Admin Panel" />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton onClick={() => handleNav('/about')}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Info />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItemButton>
        </ListItem>
      </List>

      <List sx={{ px: 1.5, pb: 2, borderTop: 1, borderColor: 'divider', pt: 1 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={toggleDarkMode} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </ListItemIcon>
            <ListItemText primary={darkMode ? 'Light Mode' : 'Dark Mode'} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const mobileNavIndex = navItems.findIndex((item) => item.path === location.pathname);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'absolute',
          left: -9999,
          zIndex: 9999,
          p: 1,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          '&:focus': { left: 8, top: 8 },
        }}
      >
        Skip to main content
      </Box>

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: alpha(theme.palette.background.paper, 0.85),
          backdropFilter: 'blur(12px)',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 1, display: { md: 'none' } }}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
          >
            <MenuIcon />
          </IconButton>
          <Box flex={1}>
            <Typography variant="body2" color="text.secondary" display={{ xs: 'none', sm: 'block' }}>
              Welcome back
            </Typography>
            <Typography variant="h6" fontWeight={700} noWrap>
              {user?.name?.split(' ')[0] || 'Student'}
            </Typography>
          </Box>
          <IconButton
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            sx={{ display: { md: 'none' }, mr: 1 }}
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.main',
              fontSize: '0.9rem',
              fontWeight: 700,
            }}
            aria-label={`${user?.name} profile`}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'S'}
          </Avatar>
        </Toolbar>
      </AppBar>

      <Box component="nav" aria-label="Main navigation" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        id="main-content"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 2.5, md: 3 },
          pb: { xs: 10, md: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, sm: 8 },
        }}
      >
        {children}
      </Box>

      {isMobile && (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.appBar,
            borderTop: 1,
            borderColor: 'divider',
            display: { md: 'none' },
          }}
        >
          <BottomNavigation
            value={mobileNavIndex >= 0 ? mobileNavIndex : false}
            onChange={(_, index) => handleNav(navItems[index].path)}
            showLabels
            sx={{ height: 64 }}
          >
            {navItems.map((item) => (
              <BottomNavigationAction
                key={item.path}
                label={item.mobileLabel}
                icon={item.icon}
                aria-label={item.text}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
};

export default Layout;
