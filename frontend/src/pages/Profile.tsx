import React from 'react';
import { Box, Typography, Paper, Avatar, Divider } from '@mui/material';
import { getUserType, getUserEmail, getUserName } from '../utils/user';

const Profile = () => {
  const userType = getUserType() || 'admin';
  const userEmail = getUserEmail() || '';
  const userName = getUserName() || '';

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              mr: 3,
              fontSize: '2rem'
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {userName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {userEmail}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            User Type
          </Typography>
          <Typography variant="h6" sx={{ textTransform: 'capitalize', mb: 3 }}>
            {userType}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Email
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {userEmail}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile; 