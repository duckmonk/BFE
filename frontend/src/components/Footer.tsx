import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer: React.FC = () => (
  <Box sx={{ bgcolor: '#fff', py: 4, mt: 8, borderTop: '1px solid #eee' }}>
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Site name</Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <FacebookIcon fontSize="small" sx={{ color: '#888' }} />
            <LinkedInIcon fontSize="small" sx={{ color: '#888' }} />
            <YouTubeIcon fontSize="small" sx={{ color: '#888' }} />
            <InstagramIcon fontSize="small" sx={{ color: '#888' }} />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Typography variant="subtitle2" fontWeight={700}>Topic</Typography>
          <Typography variant="body2">Page</Typography>
          <Typography variant="body2">Page</Typography>
          <Typography variant="body2">Page</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Typography variant="subtitle2" fontWeight={700}>Topic</Typography>
          <Typography variant="body2">Page</Typography>
          <Typography variant="body2">Page</Typography>
          <Typography variant="body2">Page</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Typography variant="subtitle2" fontWeight={700}>Topic</Typography>
          <Typography variant="body2">Page</Typography>
          <Typography variant="body2">Page</Typography>
          <Typography variant="body2">Page</Typography>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default Footer; 