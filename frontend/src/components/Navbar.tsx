import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getUserName } from '../utils/user';

const Navbar = () => {
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    navigate('/profile');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Case Management System
        </Typography>
        <IconButton
          onClick={handleAvatarClick}
          sx={{ p: 0 }}
        >
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {getUserName()?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 