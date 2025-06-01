import React from 'react';
import { Container, Typography, Box, Grid, Card, CardMedia, CardContent, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const services = [
  {
    title: 'Strategic Planning & Case Positioning',
    description: 'We work with you to understand your background, goals, and strengths — then we develop a tailored strategy to position your profile effectively with your immigration application.'
  },
  {
    title: 'Application Development & Document',
    description: 'We help shape your narrative, refine your personal statement, and strategically integrate your supporting materials to showcase your strongest qualifications.'
  },
  {
    title: 'Attorney Collaboration & Legal Filing',
    description: 'We partner with trusted immigration attorneys who handle the legal process and petition filing, ensuring your case meets all compliance standards.'
  }
];

const faqs = [
  {
    question: 'What is the cost of a consultation?',
    answer: 'Our first 15-min consultation is free. After that, the cost of a consultation could range depending on the complexity of your case and the depth of consultation required. It\'s always best to inquire directly with us for precise and tailored information based on your specific needs.'
  },
  {
    question: 'Why should I choose our services over other law firms?',
    answer: 'All of our team members have gone through the U.S. immigration process ourselves, so we understand how frustrating it can be. That\'s why we offer a truly hands-free experience: you simply bring your story, and we take care of the rest for you.'
  }
];

const Service: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#f3f2ee', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <Box sx={{ bgcolor: '#f3f2ee', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                Full Package Plan
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                End to end service for applications. From scratch to filing, we'll ask you to complete a short intake survey and share your career history. We'll handle everything else from there.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src="https://breakfree.earth/wp-content/uploads/2025/03/pexels-photo-6281030-edited-1.jpeg"
                alt="Service"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  aspectRatio: '1',
                  objectFit: 'cover'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
          Services
        </Typography>
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card sx={{ height: '100%', boxShadow: 0, bgcolor: 'transparent' }}>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    {service.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FAQ Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
          FAQs
        </Typography>
        {faqs.map((faq, index) => (
          <Accordion key={index} sx={{ mb: 2, boxShadow: 0, border: '1px solid', borderColor: 'divider' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" fontWeight="bold">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
};

export default Service; 