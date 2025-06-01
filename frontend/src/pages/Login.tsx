import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import { saveUserInfo } from '../utils/user';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await userApi.login(formData.email, formData.password);
      console.log('response', response);
      if (response.data.status === 'success') {
        console.log('response.data', response.data);
        // 保存用户信息，确保包含userEmail
        saveUserInfo({
          userId: response.data.userId,
          userName: response.data.userName,
          userType: response.data.userType,
          userEmail: formData.email // 使用登录时输入的邮箱
        });

        setTimeout(() => {
          navigate('/');
          window.location.reload(); // 让Header刷新
        }, 1500);
      } else {
        setSnackbar({
          open: true,
          message: `登录失败！${response.data.message}`,
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `登录失败！${error}`,
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="sm" sx={{ pt: 10, pb: 6, flex: 1 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto' }}>
          <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 500, fontSize: '0.95rem' }}>
            Email
          </Typography>
          <TextField
            fullWidth
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="xxxxx@breakfree.earth"
            variant="outlined"
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: '#bdbdbd',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#9e9e9e',
                }
              },
              '& .MuiOutlinedInput-input': {
                padding: '12px 16px',
                fontSize: '0.9rem',
                color: '#757575',
              }
            }}
          />

          <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 500, fontSize: '0.95rem' }}>
            Password
          </Typography>
          <TextField
            fullWidth
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Smitherton"
            variant="outlined"
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: '#bdbdbd',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#9e9e9e',
                }
              },
              '& .MuiOutlinedInput-input': {
                padding: '12px 16px',
                fontSize: '0.9rem',
                color: '#757575',
              }
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              bgcolor: '#000',
              color: '#fff',
              py: 1.5,
              textTransform: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem',
              '&:hover': {
                bgcolor: '#222'
              }
            }}
          >
            Login
          </Button>

          {/* <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              or
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="outlined"
            sx={{
              mt: 2,
              color: '#000',
              borderColor: '#000',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#222',
                bgcolor: 'transparent'
              }
            }}
          >
            Sign up with Google
          </Button> */}
        </Box>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login; 