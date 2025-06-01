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
    firstName: '',
    lastName: '',
    email: '',
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
        message: 'Submit successfully!',
        severity: 'success'
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Submit failed, please try again later',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ bgcolor: '#f3f2ee', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ pt: 6, pb: 6, flex: 1 }}>
        <Grid container spacing={6} alignItems="flex-start">
          {/* 左侧内容 */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h2" fontWeight={700} gutterBottom>
              About Us
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              At Break Free Earth, we help talented professionals, researchers, and innovators navigate their U.S. immigration pathways and move their lives forward.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We are a specialized consulting firm that collaborates with top immigration law firms to support employment-based visa applications, including the H-1B, EB-1, EB-2 NIW (National Interest Waiver), and O-1. While we do not provide legal representation ourselves, We partner with trusted attorneys to ensure that every petition meets all legal requirements.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Our role is to help you build a compelling case. We focus on strategy, personal narrative development, and presenting your professional achievements in a way that aligns with eligibility criteria. Whether you're pursuing an extraordinary ability visa or a national interest waiver, we bring structure, clarity, and storytelling expertise to your application.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Break Free Earth was founded by professionals from leading technology companies who have personally experienced the challenges of global mobility. We've been through the visa process ourselves and we understand how overwhelming, high-stakes, and personal it can feel.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              We believe your talent shouldn't be limited by borders and we're here to help you take the next step with confidence.
            </Typography>

            {/* Contact Form */}
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
                src="https://breakfree.earth/wp-content/uploads/2025/03/pexels-photo-3183151.jpeg"
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