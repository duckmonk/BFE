import React from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';

const steps = [
  {
    title: 'Step1: Information Collection',
    img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    desc: 'We collect all relevant information. The key point here is not just giving assertions but providing objective evidence, including any possible recommenders.'
  },
  {
    title: 'Step2: Finalize Proposed Endeavors',
    img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    desc: 'After you submit your info, we will provide updates within a few days. Once you confirm, we move forward with the next steps.'
  },
  {
    title: 'Step3: Petition Letter',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    desc: 'Once we have a draft of Prong 1, we will begin working on recommendation letters. This helps align the overall strategy effectively.'
  },
  {
    title: 'Step4: Recommendation Letters',
    img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    desc: 'After finalizing your endeavor and Prong 1, we proceed with recommendation letters. This is the optimal time to have them drafted.'
  },
  {
    title: 'Step5: Exhibit List & Immigration Forms',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    desc: 'We organize all required documents, complete your immigration forms, and send them for your review before submission.'
  },
  {
    title: 'Step6: Filing',
    img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    desc: 'We submit to USCIS and await results. You will receive a case number in about 2 weeks, and premium processing takes 45 business days.'
  },
];

const Guidelines: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#fafbfc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ pt: 6, pb: 6, flex: 1 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
          NIW Overview Process
        </Typography>
        <Grid container spacing={4}>
          {steps.map((step, idx) => (
            <Grid size={{ xs: 12, md: 6 }} key={idx}>
              <Card sx={{ boxShadow: 0, bgcolor: '#fff' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={step.img}
                  alt={step.title}
                  sx={{ borderRadius: 2 }}
                />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Guidelines; 