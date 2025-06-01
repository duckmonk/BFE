import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Grid } from '@mui/material';

interface Case {
  title: string;
  author: string;
  image: string;
}

interface SampleCaseProps {
  title?: string;
  cases: Case[];
}

const SampleCase: React.FC<SampleCaseProps> = ({ 
  title = "Sample Cases",
  cases 
}) => {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Grid container spacing={3}>
        {cases.map((item, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={index}>
            <Card>
              <CardMedia 
                component="img" 
                height="160" 
                image={item.image} 
                alt={item.title} 
              />
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700}>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">{item.author}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SampleCase; 