import React, { useState } from 'react';
import { Box, Typography, Paper, Avatar, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
import { getUserType, getUserEmail, getUserName } from '../utils/user';
import { userApi } from '../services/api';

const Profile = () => {
  const userType = getUserType() || 'admin';
  const userEmail = getUserEmail() || '';
  const userName = getUserName() || '';

  // 新增：重置密码相关状态
  const [resetOpen, setResetOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const handleResetPassword = async () => {
    try {
      await userApi.resetPassword(oldPassword, newPassword);
      setSnackbar({ open: true, message: 'Password reset successfully!', severity: 'success' });
      setResetOpen(false);
      setOldPassword('');
      setNewPassword('');
    } catch (e: any) {
      setSnackbar({ open: true, message: e?.message || 'Password reset failed', severity: 'error' });
    }
  };

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

        {/* 新增：重置密码按钮 */}
        <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={() => setResetOpen(true)}>
          Reset Password
        </Button>
      </Paper>

      {/* 重置密码弹窗 */}
      <Dialog open={resetOpen} onClose={() => setResetOpen(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Old Password"
            type="password"
            fullWidth
            sx={{ mb: 2, mt: 1 }}
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            sx={{ mb: 2 }}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetOpen(false)}>Cancel</Button>
          <Button onClick={handleResetPassword} variant="contained" color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* 提示条 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile; 