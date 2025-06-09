import React from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';

const Terms: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#f3f2ee', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ height: 'var(--wp--preset--spacing--40)' }} aria-hidden="true" />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12 }}>
            <Typography 
              variant="h1" 
              align="center" 
              sx={{ 
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                mb: 2
              }}
            >
              <strong>Terms and Conditions</strong>
            </Typography>

            <Typography 
              variant="h3" 
              align="center" 
              sx={{ 
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                mb: 4
              }}
            >
              <strong>Last updated: March 25, 2025</strong>
              <br />
              San Francisco, CA 12345
            </Typography>

            <Box sx={{ py: 2.5 }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  textAlign: 'justify',
                  fontSize: '1.1rem',
                  lineHeight: 1.6
                }}
              >
                Welcome to Break Free Earth LLC. Please read these Terms and Conditions ("Terms") carefully before using our website and services. By accessing or using our website, you agree to be bound by these Terms. If you do not agree, please do not use our website or services.
              </Typography>
            </Box>

            <Divider sx={{ my: 4, opacity: 0.2 }} />

            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: '1.5rem',
                fontWeight: 700,
                mb: 2
              }}
            >
              <strong>1. About Break Free Earth LLC</strong>
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                mb: 3
              }}
            >
              Break Free Earth LLC is a private consulting company that provides strategic support and personalized guidance for individuals navigating the U.S. immigration process. We are not a law firm and do not offer legal advice or legal representation. Legal services are provided exclusively by licensed immigration attorneys with whom we partner.
            </Typography>

            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: '1.5rem',
                fontWeight: 700,
                mb: 2
              }}
            >
              <strong>2. No Legal Advice</strong>
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                mb: 3
              }}
            >
              The information provided on this website is for general informational purposes only and is not intended as legal advice. Any content, guidance, or support we provide is not a substitute for professional legal counsel. For legal questions or concerns, we encourage you to consult with a qualified immigration attorney.
            </Typography>

            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: '1.5rem',
                fontWeight: 700,
                mb: 2
              }}
            >
              <strong>3. Use of Services</strong>
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                mb: 2
              }}
            >
              By using our services, you represent that:
            </Typography>
            <Box 
              component="ul" 
              sx={{ 
                pl: 4, 
                mb: 2,
                '& li': {
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  mb: 1
                }
              }}
            >
              <Typography component="li">
                You are at least 18 years old (or have parental consent).
              </Typography>
              <Typography component="li">
                You will provide accurate, current, and complete information.
              </Typography>
              <Typography component="li">
                You will not use our services for unlawful or harmful purposes.
              </Typography>
            </Box>
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                mb: 3
              }}
            >
              We reserve the right to refuse or terminate access to our services at our discretion.
            </Typography>

            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: '1.5rem',
                fontWeight: 700,
                mb: 2
              }}
            >
              <strong>4. Limitation of Liability</strong>
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                mb: 3
              }}
            >
              Break Free Earth LLC is not liable for any indirect, incidental, or consequential damages arising from your use of our website or services. We do not guarantee the outcome of any immigration petition or application, even when services are provided in collaboration with licensed attorneys.
            </Typography>

            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: '1.5rem',
                fontWeight: 700,
                mb: 2
              }}
            >
              <strong>5. Third-Party Links</strong>
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                mb: 3
              }}
            >
              Our website may contain links to third-party websites. These links are provided for convenience only. We do not endorse or control the content of these websites and are not responsible for their accuracy or availability.
            </Typography>

            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: '1.5rem',
                fontWeight: 700,
                mb: 2
              }}
            >
              <strong>6. Privacy</strong>
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                mb: 3
              }}
            >
              Your use of this website is also governed by our Privacy Policy. By using our site, you consent to our collection and use of your personal information as described in that policy.
            </Typography>

            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: '1.5rem',
                fontWeight: 700,
                mb: 2
              }}
            >
              <strong>7. Modifications</strong>
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                mb: 3
              }}
            >
              We may update these Terms from time to time. Changes will be posted on this page with an updated effective date. Continued use of our website after changes are posted constitutes your acceptance of the updated Terms.
            </Typography>

            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: '1.5rem',
                fontWeight: 700,
                mb: 2
              }}
            >
              <strong>8. Governing Law</strong>
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                mb: 3
              }}
            >
              These Terms shall be governed by the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising from your use of our website or services shall be resolved in the courts of California.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Terms; 