import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, Grid, MenuItem, Alert, Snackbar } from '@mui/material';
import { inquiryApi } from '../services/api';

// 定义表单数据接口
interface InquiryFormData {
  // 基本信息
  petitionerEmail: string;
  petitionerName: string;
  petitionerField: string;

  // 影响力相关
  impactBenefits: boolean;
  impactUsGov: boolean;
  impactRecognition: boolean;
  roleVerified: boolean;
  impactApplied: boolean;
  impactAppliedNote: string;

  // 成就相关
  achievementsSpeaking: boolean;
  achievementsSpeakingNote: string;
  achievementsFunding: boolean;
  achievementsFundingNote: string;
  achievementsGov: boolean;
  achievementsGovNote: string;
  achievementsOffers: boolean;
  achievementsOffersNote: string;
  achievementsMedia: boolean;
  achievementsMediaNote: string;

  // 社交平台相关
  socialPlatform: string;
  socialPlatformOther: string;

  // 其他信息
  resume: string;
  message: string;
}


const socialPlatforms = [
  "LinkedIn",
  "RedNote",
  "Wechat",
  "Friend Recommendation",
  "Other"
];

const Inquiry: React.FC = () => {
  // 表单状态
  const [formData, setFormData] = useState<InquiryFormData>({
    petitionerEmail: '',
    petitionerName: '',
    petitionerField: '',
    impactBenefits: false,
    impactUsGov: false,
    impactRecognition: false,
    roleVerified: false,
    impactApplied: false,
    impactAppliedNote: '',
    achievementsSpeaking: false,
    achievementsSpeakingNote: '',
    achievementsFunding: false,
    achievementsFundingNote: '',
    achievementsGov: false,
    achievementsGovNote: '',
    achievementsOffers: false,
    achievementsOffersNote: '',
    achievementsMedia: false,
    achievementsMediaNote: '',
    socialPlatform: '',
    socialPlatformOther: '',
    resume: '',
    message: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // 添加一个 useEffect 来处理提交后的滚动
  useEffect(() => {
    if (isSubmitted) {
      window.scrollTo(0, 0);
    }
  }, [isSubmitted]);

  // 处理表单变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    // 针对 select 的 YES/NO 处理
    if (
      [
        'impactBenefits',
        'impactUsGov',
        'impactRecognition',
        'roleVerified',
        'impactApplied',
        'achievementsSpeaking',
        'achievementsFunding',
        'achievementsGov',
        'achievementsOffers',
        'achievementsMedia'
      ].includes(name)
    ) {
      newValue = value === 'true';
    } else if (type === 'checkbox') {
      newValue = e.target.checked;
    }
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await inquiryApi.submit(formData);
      setSnackbar({
        open: true,
        message: 'Submit successfully!',
        severity: 'success'
      });
      setIsSubmitted(true);
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

  if (isSubmitted) {
    return (
      <Box sx={{ 
        bgcolor: '#f3f2ee', 
        minHeight: '50vh', // 减小最小高度
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center' // 垂直居中
      }}>
        <Container maxWidth="lg" sx={{ py: 4 }}> {/* 减小上下padding */}
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: 'center' }}>
              <Typography variant="h4" component="h1" fontWeight={700} gutterBottom> {/* 减小标题大小 */}
                Thank you for your inquiry!
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, mb: 1 }}> {/* 减小间距和字体大小 */}
                We will get back to you in 3 days! Via the email you provided.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f3f2ee', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ pt: 6, pb: 6, flex: 1 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h3" component="h1" fontWeight={700} gutterBottom align="center">
              Submit Your Inquires
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }} align="center">
              Please provide the following information so we can better evaluate whether we can take your case.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
              <TextField
                name="petitionerEmail"
                label="Your contact Email"
                fullWidth
                size="small"
                type="email"
                value={formData.petitionerEmail}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
              />
              
              <TextField
                name="petitionerName"
                label="Your name"
                fullWidth
                size="small"
                value={formData.petitionerName}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
              />

              <TextField
                name="petitionerField"
                label="Your work field"
                fullWidth
                size="small"
                value={formData.petitionerField}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
              />

              <TextField
                name="impactBenefits"
                label="Do you believe your work benefits the U.S. beyond your job role?"
                fullWidth
                size="small"
                select
                value={formData.impactBenefits ? "true" : "false"}
                onChange={handleChange}
                sx={{ mb: 3 }}
              >
                <MenuItem value="true">YES</MenuItem>
                <MenuItem value="false">NO</MenuItem>
              </TextField>

              <TextField
                name="impactUsGov"
                label="Have you participated in projects related to the U.S. government?"
                fullWidth
                size="small"
                select
                value={formData.impactUsGov ? "true" : "false"}
                onChange={handleChange}
                sx={{ mb: 3 }}
              >
                <MenuItem value="true">YES</MenuItem>
                <MenuItem value="false">NO</MenuItem>
              </TextField>

              <TextField
                name="impactRecognition"
                label="Have you worked on publicly recognized high-impact projects?"
                fullWidth
                size="small"
                select
                value={formData.impactRecognition ? "true" : "false"}
                onChange={handleChange}
                sx={{ mb: 3 }}
              >
                <MenuItem value="true">YES</MenuItem>
                <MenuItem value="false">NO</MenuItem>
              </TextField>

              <TextField
                name="roleVerified"
                label="Can your company provide evidence that you played a key role in such a project?"
                fullWidth
                size="small"
                select
                value={formData.roleVerified ? "true" : "false"}
                onChange={handleChange}
                sx={{ mb: 3 }}
              >
                <MenuItem value="true">YES</MenuItem>
                <MenuItem value="false">NO</MenuItem>
              </TextField>

              <TextField
                name="impactApplied"
                label="Have your innovations been widely applied"
                fullWidth
                size="small"
                select
                value={formData.impactApplied ? "true" : "false"}
                onChange={handleChange}
                sx={{ mb: 3 }}
              >
                <MenuItem value="true">YES</MenuItem>
                <MenuItem value="false">NO</MenuItem>
              </TextField>

              {formData.impactApplied && (
                <TextField
                  name="impactAppliedNote"
                  label='If yes, please explain'
                  fullWidth
                  multiline
                  minRows={2}
                  value={formData.impactAppliedNote}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />
              )}

              <TextField
                name="achievementsSpeaking"
                label="Have you been invited to speak at industry or academic conferences?"
                fullWidth
                size="small"
                select
                value={formData.achievementsSpeaking ? "true" : "false"}
                onChange={handleChange}
                sx={{ mb: 3 }}
              >
                <MenuItem value="true">YES</MenuItem>
                <MenuItem value="false">NO</MenuItem>
              </TextField>

              {formData.achievementsSpeaking && (
                <TextField
                  name="achievementsSpeakingNote"
                  label="If yes, please explain"
                  fullWidth
                  multiline
                  minRows={2}
                  value={formData.achievementsSpeakingNote}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />
              )}

              <TextField
                name="achievementsFunding"
                label="Have you received research funding or investment support?"
                fullWidth
                size="small"
                select
                value={formData.achievementsFunding ? "true" : "false"}
                onChange={handleChange}
                sx={{ mb: 3 }}
              >
                <MenuItem value="true">YES</MenuItem>
                <MenuItem value="false">NO</MenuItem>
              </TextField>

              {formData.achievementsFunding && (
                <TextField
                  name="achievementsFundingNote"
                  label="If yes, please explain"
                  fullWidth
                  multiline
                  minRows={2}
                  value={formData.achievementsFundingNote}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />
              )}

              <TextField
                name="achievementsGov"
                label="Have you received recognition from government officials"
                fullWidth
                size="small"
                select
                value={formData.achievementsGov ? "true" : "false"}
                onChange={handleChange}
                sx={{ mb: 3 }}
              >
                <MenuItem value="true">YES</MenuItem>
                <MenuItem value="false">NO</MenuItem>
              </TextField>

              {formData.achievementsGov && (
                <TextField
                  name="achievementsGovNote"
                  label="If yes, please explain"
                  fullWidth
                  multiline
                  minRows={2}
                  value={formData.achievementsGovNote}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />
              )}

              <TextField
                name="achievementsOffers"
                label="Have you received multiple recent or past job offers?"
                fullWidth
                size="small"
                select
                value={formData.achievementsOffers ? "true" : "false"}
                onChange={handleChange}
                sx={{ mb: 3 }}
              >
                <MenuItem value="true">YES</MenuItem>
                <MenuItem value="false">NO</MenuItem>
              </TextField>

              {formData.achievementsOffers && (
                <TextField
                  name="achievementsOffersNote"
                  label="If yes, please explain"
                  fullWidth
                  multiline
                  minRows={2}
                  value={formData.achievementsOffersNote}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />
              )}

              <TextField
                name="achievementsMedia"
                label="Have you been featured in media reports verifying your contributions?"
                fullWidth
                size="small"
                select
                value={formData.achievementsMedia ? "true" : "false"}
                onChange={handleChange}
                sx={{ mb: 3 }}
              >
                <MenuItem value="true">YES</MenuItem>
                <MenuItem value="false">NO</MenuItem>
              </TextField>

              {formData.achievementsMedia && (
                <TextField
                  name="achievementsMediaNote"
                  label="If yes, please explain"
                  fullWidth
                  multiline
                  minRows={2}
                  value={formData.achievementsMediaNote}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />
              )}

              <TextField
                name="socialPlatform"
                label="How did you hear about us?"
                fullWidth
                size="small"
                select
                value={formData.socialPlatform}
                onChange={handleChange}
                sx={{ mb: 3 }}
              >
                {socialPlatforms.map((platform) => (
                  <MenuItem key={platform} value={platform}>
                    {platform}
                  </MenuItem>
                ))}
              </TextField>


              {formData.socialPlatform === 'Other' && (
                <TextField
                  name="socialPlatformOther"
                  label="If others, please explain"
                  fullWidth
                  size="small"
                  value={formData.socialPlatformOther}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />
              )}

              <Button 
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  bgcolor: '#000',
                  color: '#fff',
                  py: 1.5,
                  fontSize: 16,
                  textTransform: 'none',
                  ':hover': { bgcolor: '#222' }
                }}
              >
                Submit
              </Button>
            </Box>
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

export default Inquiry; 