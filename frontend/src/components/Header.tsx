import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: '#f3f2ee' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: '#000',
            fontWeight: 600
          }}
        >
          Break Free Earth
        </Typography>

        {user ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {user.userType === 'client' ? (
                <Button
                  component={RouterLink}
                  to="/landing"
                  color="inherit"
                  sx={{
                    color: '#000',
                    fontWeight: isActive('/landing') ? 600 : 400,
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                >
                  Landing Page
                </Button>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/inquiry-dashboard"
                    color="inherit"
                    sx={{
                      color: '#000',
                      fontWeight: isActive('/inquiry-dashboard') ? 600 : 400,
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                    }}
                  >
                    Inquiry Dashboard
                  </Button>
                  {user.userType === 'marketing_manager' || user.userType === 'admin' ? (
                    <Button
                      component={RouterLink}
                      to="/case-detail-dashboard"
                      color="inherit"
                      sx={{
                        color: '#000',
                        fontWeight: isActive('/case-detail-dashboard') ? 600 : 400,
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                      }}
                    >
                      Case Dashboard
                    </Button>
                  ) : null}
                </>
              )}
              {user.userType === 'admin' && (
                <Button
                  component={RouterLink}
                  to="/staff-management"
                  color="inherit"
                  sx={{
                    color: '#000',
                    fontWeight: isActive('/staff-management') ? 600 : 400,
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                >
                  Staff Management
                </Button>
              )}
              <IconButton
                onClick={handleMenu}
                size="small"
                sx={{ ml: 2 }}
                aria-controls="menu-appbar"
                aria-haspopup="true"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {user.userName?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              component={RouterLink}
              to="/service"
              color="inherit"
              sx={{
                color: '#000',
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
              }}
            >
              Service
            </Button>
            <Button
              component={RouterLink}
              to="/about"
              color="inherit"
              sx={{
                color: '#000',
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
              }}
            >
              About US
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                bgcolor: '#000',
                color: '#fff',
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: '#333'
                }
              }}
            >
              Login
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 