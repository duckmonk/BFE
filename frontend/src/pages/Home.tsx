import React from 'react';
import { Box, Container, Typography, Grid, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Mapping for WP preset spacing variables (approximate conversion)
  const wpSpacing = {
    '--wp--preset--spacing--20': '0.44rem',
    '--wp--preset--spacing--30': '0.25rem',
    '--wp--preset--spacing--40': '1rem',
    '--wp--preset--spacing--50': 'clamp(1.25rem, 4.19vw, 1.75rem)',
    '--wp--preset--spacing--60': 'clamp(1.75rem, 4.19vw, 3.5rem)',
    '--wp--preset--spacing--70': 'clamp(3rem, 6.59vw, 5.5rem)',
    '--wp--preset--spacing--80': 'clamp(4.5rem, 10.78vw, 9rem)',
  };

  // Mapping for WP preset font sizes (approximate conversion)
  const wpFontSizes = {
    '--wp--preset--font-size--small': '0.875em',
    '--wp--preset--font-size--medium': '1em',
    '--wp--preset--font-size--large': '2.25em',
    '--wp--preset--font-size--x-large': '3em',
    '--wp--preset--font-size--x-small': '0.72rem',
    '--wp--preset--font-size--xx-large': '2.747rem',
    '--wp--preset--font-size--xxx-large': '4.292rem',
    '--wp--preset--font-size--xxxx-large': '6.706rem',
  };

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ bgcolor: '#f3f2ee', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <Box sx={{ padding: `${wpSpacing['--wp--preset--spacing--50']} ${wpSpacing['--wp--preset--spacing--60']}` }}>
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: '1000px' }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 3, lineHeight: 1.2 }}>
              <Box component="strong">Immigration Is Complicated — But We Make Your Path Clear and Achievable.</Box>
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontFamily: 'Albert Sans, sans-serif', fontSize: '1.25em', letterSpacing: '0.02em', lineHeight: 'calc(1em + 0.625rem)' }}>
              Navigating the immigration process can be confusing and stressful. Our team is committed to providing you with honest, straightforward guidance, cutting through the noise to give you a clear path forward. With personalized support, smart tools, and trusted partners, we ensure you're always in the loop, confident in the next steps, and never misled.
            </Typography>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#000',
                color: '#fff',
                borderRadius: '17px',
                fontWeight: 500,
                px: '1.2rem',
                py: '1rem',
                textTransform: 'none',
                fontFamily: 'Lucette, sans-serif',
                fontSize: wpFontSizes['--wp--preset--font-size--large'],
                letterSpacing: '-0.01em',
                lineHeight: 1,
                '&:hover': { bgcolor: '#3d3d31' },
              }}
              onClick={() => handleLinkClick('/inquiry')}
            >
              Get Started Today
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Spacer */}
      <Box sx={{ height: '9px' }} aria-hidden="true"></Box>

      {/* Our Workflow Section */}
      <Box sx={{ padding: `${wpSpacing['--wp--preset--spacing--50']} 0` }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              position: 'relative',
              minHeight: '829px',
              aspectRatio: 'unset',
              backgroundImage: 'url(https://breakfree.earth/wp-content/uploads/2025/03/pexels-photo-27686060.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: '8% 47%',
              display: 'flex',
              alignItems: 'center',
              padding: `${wpSpacing['--wp--preset--spacing--50']} ${wpSpacing['--wp--preset--spacing--60']}`,
              color: '#fff',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: '#fcfcfa',
                opacity: 0.1,
                zIndex: 1,
              },
            }}
          >
            <Box sx={{ zIndex: 2 }}>
              <Typography variant="h3" fontWeight={700} sx={{ mb: 3 }}>
                Our Workflow
              </Typography>
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  <Box component="strong">• Initial Inquiry</Box> – Get a personalized assessment, no commitment required.
                </Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  <Box component="strong">• Consultation</Box> – We'll schedule a quick call to align on goals and next steps.
                </Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  <Box component="strong">• Document Review</Box> – We will go over the details and prepare materials.
                </Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  <Box component="strong">• Submission</Box> – File your application with confidence.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Spacer */}
      <Box sx={{ height: '49px' }} aria-hidden="true"></Box>

      {/* We Understand Your Concerns Section */}
      <Box sx={{ padding: `${wpSpacing['--wp--preset--spacing--50']} ${wpSpacing['--wp--preset--spacing--60']}` }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={700} sx={{ textAlign: 'center', mb: 6 }}>
            We Understand Your Concerns
          </Typography>
          <Grid container spacing={{
            xs: 2,
            md: wpSpacing['--wp--preset--spacing--60']
          }}>
            {/* Concern 1 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box
                  component="img"
                  src="https://breakfree.earth/wp-content/uploads/2025/03/image-7.jpeg"
                  alt=""
                  sx={{
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '1',
                    objectFit: 'cover',
                    mb: 2,
                  }}
                />
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                  We Understand Your Priorities
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'Albert Sans, sans-serif', letterSpacing: '0.02em', lineHeight: 'calc(1em + 0.625rem)' }}>
                  We know one-size-fits-all services don't work. We respond quickly, keep you informed, and treat your case with the attention it deserves.
                </Typography>
              </Box>
            </Grid>
            {/* Concern 2 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box
                  component="img"
                  src="https://breakfree.earth/wp-content/uploads/2025/03/pexels-photo-227675.jpeg"
                  alt=""
                  sx={{
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '1',
                    objectFit: 'cover',
                    mb: 2,
                  }}
                />
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                  Strategy That Goes Beyond AI
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'Albert Sans, sans-serif', letterSpacing: '0.02em', lineHeight: 'calc(1em + 0.625rem)' }}>
                  AI speeds things up but it can't truly tell your story. We craft thoughtful, strategic cases that stand out, especially when the details matter most.
                </Typography>
              </Box>
            </Grid>
            {/* Concern 3 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box
                  component="img"
                  src="https://breakfree.earth/wp-content/uploads/2025/03/pexels-photo-7303393.jpeg"
                  alt=""
                  sx={{
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '1',
                    objectFit: 'cover',
                    mb: 2,
                  }}
                />
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                  We Stand Behind Our Work
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'Albert Sans, sans-serif', letterSpacing: '0.02em', lineHeight: 'calc(1em + 0.625rem)' }}>
                  We're fully invested in every case, but USCIS decisions can be unpredictable as policies evolve. We stay on top of those shifts to give your case the strongest possible foundation.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Spacer */}
      <Box sx={{ height: '49px' }} aria-hidden="true"></Box>

      {/* Our Advantages Section */}
      <Box sx={{ padding: `${wpSpacing['--wp--preset--spacing--40']} ${wpSpacing['--wp--preset--spacing--60']}` }}>
        <Container maxWidth="lg">
          <Grid container spacing={{
            xs: 4,
            md: wpSpacing['--wp--preset--spacing--60']
          }} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h3" fontWeight={700} sx={{ mb: 4 }}>
                Our Advantages
              </Typography>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                Truly Hassle-Free
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, fontFamily: 'Albert Sans, sans-serif', letterSpacing: '0.02em', lineHeight: 'calc(1em + 0.625rem)' }}>
                Avoid the burden of complex writing. We manage the entire process with efficiency and precision.
              </Typography>

              <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                Industry Expertise That Gives You an Advantage
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, fontFamily: 'Albert Sans, sans-serif', letterSpacing: '0.02em', lineHeight: 'calc(1em + 0.625rem)' }}>
                We bring years of industry experience to understand your unique needs, offering tailored solutions that go beyond traditional legal advice.
              </Typography>

              <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                Human Expertise Enhanced by AI Technology
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, fontFamily: 'Albert Sans, sans-serif', letterSpacing: '0.02em', lineHeight: 'calc(1em + 0.625rem)' }}>
                Our experts drive strategy and refinement for each case, while our AI streamlines the process.
              </Typography>

              <Box sx={{ display: 'flex', gap: wpSpacing['--wp--preset--spacing--40'], flexDirection: { xs: 'column', md: 'row' } }}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#000',
                    color: '#fff',
                    borderRadius: '17px',
                    fontWeight: 500,
                    px: '1.2rem',
                    py: '1rem',
                    textTransform: 'none',
                    fontFamily: 'Lucette, sans-serif',
                    fontSize: wpFontSizes['--wp--preset--font-size--large'],
                    letterSpacing: '-0.01em',
                    lineHeight: 1,
                    '&:hover': { bgcolor: '#3d3d31' },
                  }}
                  onClick={() => handleLinkClick('/service')}
                >
                  Learn more
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src="https://breakfree.earth/wp-content/uploads/2025/03/pexels-photo-6016352.jpeg"
                alt=""
                sx={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '1',
                  objectFit: 'cover',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 