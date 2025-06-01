import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Alert, Snackbar } from '@mui/material';
import Grid from '@mui/material/Grid';
import { contactApi } from '../services/api';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

const About: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: 'Jane',
    lastName: 'Smitherton',
    email: 'email@janesfakedomain.net',
    message: ''
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
      await contactApi.submit(formData);
      setSnackbar({
        open: true,
        message: '提交成功！',
        severity: 'success'
      });
      // 清空表单
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : '提交失败，请稍后重试',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ pt: 6, pb: 6, flex: 1 }}>
        <Grid container spacing={6} alignItems="flex-start">
          {/* 左侧内容 */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h2" fontWeight={700} gutterBottom>
              About
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Subheading for description or instructions
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Body text for your whole article or post. We'll put in some lorem ipsum to show how a filled-out page might look:
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Excepteur efficient emerging, minim veniam anim aute carefully curated Ginza conversation exquisite perfect nostrud nisi intricate Content. Qui  international first-class nulla ut. Punctual adipisicing, essential lovely queen tempor eiusmod irure. Exclusively izakaya charming Scandinavian impeccable aute quality of life soft power pariatur Melbourne occaecat discerning. Qui wardrobe aliquip, et Porter destination Toto remarkable officia Helsinki excepteur Basset hound. Zürich sleepy perfect consectetur.
            </Typography>
            <Box sx={{ mt: 6 }} component="form" onSubmit={handleSubmit}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Contact me
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField 
                    label="First name" 
                    fullWidth 
                    size="small" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField 
                    label="Last name" 
                    fullWidth 
                    size="small" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField 
                    label="Email address" 
                    fullWidth 
                    size="small" 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField 
                    label="Your message" 
                    fullWidth 
                    size="small" 
                    multiline 
                    minRows={3} 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter your question or message" 
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button 
                    type="submit"
                    variant="contained" 
                    fullWidth 
                    sx={{ bgcolor: '#000', color: '#fff', fontWeight: 500, py: 1.5, fontSize: 16, ':hover': { bgcolor: '#222' } }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          {/* 右侧图片 */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 3, boxShadow: 0, bgcolor: 'transparent' }}>
              <img
                src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=400&h=500&q=80"
                alt="profile"
                style={{ width: '100%', borderRadius: 16, objectFit: 'cover', background: '#eee' }}
              />
            </Paper>
          </Grid>
        </Grid>
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

export default About; 