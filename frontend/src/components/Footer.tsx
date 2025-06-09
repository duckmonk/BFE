import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ bgcolor: '#f3f2ee', padding: 'clamp(3rem, 6.59vw, 5.5rem) clamp(1.75rem, 4.19vw, 3.5rem)' }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 'clamp(1.75rem, 4.19vw, 3.5rem)' }} justifyContent="space-between">
          <Grid>
            <Typography variant="h4" fontWeight={500} sx={{ fontFamily: 'Lucette, sans-serif', mb: 2 }}>
              Break Free Earth
            </Typography>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  textAlign: 'right',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
                onClick={() => navigate('/about')}
              >
                About
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  textAlign: 'right',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
                onClick={() => navigate('/terms')}
              >
                Disclaimer
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  textAlign: 'right',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
                onClick={() => navigate('/terms')}
              >
                Terms and Conditions
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Typography variant="body2" sx={{ textAlign: 'center', mt: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          © 2025 Break Free Earth LLC. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 