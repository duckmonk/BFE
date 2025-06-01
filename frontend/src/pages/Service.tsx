import React from 'react';
import { Container, Typography, Box, Grid, Card, CardMedia, CardContent } from '@mui/material';

const cases = [
  {
    title: 'Industry',
    author: 'Author',
    img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80'
  },
  {
    title: 'half - half',
    author: 'Author',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
  },
  {
    title: 'Academic',
    author: 'Author',
    img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'
  }
];

const Service: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ pt: 6, pb: 6, flex: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sample Cases
        </Typography>
        <Grid container spacing={4}>
          {cases.map((item, idx) => (
            <Grid size={{ xs: 12 }} key={idx}>
              <Card sx={{ boxShadow: 0 }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={item.img}
                  alt={item.title}
                  sx={{ borderRadius: 2 }}
                />
                <CardContent sx={{ px: 0 }}>
                  <Typography variant="subtitle1" fontWeight={600}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.author}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Service; 