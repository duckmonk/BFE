import React from 'react';
import { Popover, Box, Typography, Avatar, Divider } from '@mui/material';
import { getUserType, getUserEmail, getUserName } from '../utils/user';

interface UserProfilePopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const UserProfilePopover: React.FC<UserProfilePopoverProps> = ({ anchorEl, onClose }) => {
  const open = Boolean(anchorEl);
  const userType = getUserType() || 'admin';
  const userEmail = getUserEmail() || '';
  const userName = getUserName() || '';

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        elevation: 3,
        sx: {
          width: 280,
          p: 2,
          mt: 1.5,
          borderRadius: 2,
        },
      }}
      slotProps={{
        paper: {
          sx: {
            overflow: 'visible',
            mt: 1.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: 'primary.main',
            mr: 2,
          }}
        >
          {userName.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {userName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userEmail}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          User Type
        </Typography>
        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
          {userType}
        </Typography>
      </Box>
    </Popover>
  );
};

export default UserProfilePopover; 