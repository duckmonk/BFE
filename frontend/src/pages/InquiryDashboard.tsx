import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Grid, TextField, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { inquiryApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';

interface Inquiry {
  id: number;
  userId: number | null;
  createTimestamp: number;
  petitionerEmail: string;
  petitionerName: string;
  petitionerField: string;
  impactBenefits: boolean;
  impactUsGov: boolean;
  impactRecognition: boolean;
  roleVerified: boolean;
  impactApplied: boolean;
  impactAppliedNote: string;
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
  socialPlatform: string;
  socialPlatformOther: string;
}

export default function InquiryDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [userInfo, setUserInfo] = useState<{ userId: number; password: string; name: string; email: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await inquiryApi.getInquiries();
      setInquiries(response.data.records || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch inquiries');
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  // 格式化时间戳
  const formatTimestamp = (timestamp: number) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  // 格式化成就信息
  const formatAchievements = (inquiry: Inquiry) => {
    const achievements = [];
    if (inquiry.achievementsSpeaking) achievements.push('Speaking');
    if (inquiry.achievementsFunding) achievements.push('Funding');
    if (inquiry.achievementsGov) achievements.push('Government');
    if (inquiry.achievementsOffers) achievements.push('Offers');
    if (inquiry.achievementsMedia) achievements.push('Media');
    return achievements.join(', ') || 'None';
  };

  const handleCaseDetailClick = (inquiry: Inquiry) => {
    if (inquiry.userId) {
      // 如果已有userId，跳转到case detail页面
      navigate(`/case-details/${inquiry.userId}`);
    } else {
      // 否则打开确认对话框
      setSelectedInquiry(inquiry);
      setOpenDialog(true);
    }
  };

  const handleCreateUser = async () => {
    if (!selectedInquiry) return;
    
    try {
      // 调用创建用户的API，传入inquiry id
      const response = await userApi.createUserByInquiry({
        inquiryId: selectedInquiry.id,
        email: selectedInquiry.petitionerEmail,
        name: selectedInquiry.petitionerName
      });
      
      // 保存用户信息
      setUserInfo({
        userId: response.data.userId,
        password: response.data.password,
        name: response.data.name,
        email: response.data.email
      });
      
      
      // 关闭创建对话框，显示成功对话框
      setOpenDialog(false);
      setShowSuccessDialog(true);
      
      // 刷新inquiry列表
      fetchInquiries();
    } catch (err) {
      console.error('Error creating user:', err);
      alert('创建用户失败');
    }
  };

  const handleApplyFilter = async () => {
    try {
      setLoading(true);
      const response = await inquiryApi.getInquiries({
        dateStart: dateStart ? new Date(dateStart).getTime() / 1000 : undefined,
        dateEnd: dateEnd ? new Date(dateEnd).getTime() / 1000 : undefined
      });
      setInquiries(response.data.records || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch inquiries');
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', bgcolor: '#fff', borderRadius: 2, boxShadow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">Marketing Inquiry Dashboard</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography>Welcome, User</Typography>
            <IconButton><AccountCircleIcon /></IconButton>
          </Box>
        </Box>

        {/* 筛选区 */}
        <Grid container spacing={2} mb={2}>
          <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField 
              fullWidth 
              label="Date start" 
              placeholder="mm/dd/yyyy" 
              size="small"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
            />
            <TextField 
              fullWidth 
              label="Date end" 
              placeholder="mm/dd/yyyy" 
              size="small"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
            />
            <Button 
              variant="contained" 
              onClick={handleApplyFilter}
              sx={{ 
                bgcolor: '#000',
                color: '#fff',
                '&:hover': {
                  bgcolor: '#333'
                }
              }}
            >
              Apply
            </Button>
          </Box>
          </Grid>
        </Grid>

        {/* 数据表格 */}
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Inquiry Timestamp</TableCell>
              <TableCell>Case Detail</TableCell>
                <TableCell>Petitioner Email</TableCell>
                <TableCell>Petitioner Name</TableCell>
                <TableCell>Petitioner Field</TableCell>
                <TableCell>Work Benefits</TableCell>
                <TableCell>US Gov Projects</TableCell>
                <TableCell>High Impact Projects</TableCell>
                <TableCell>Key Role Verification</TableCell>
                <TableCell>Applied Innovations</TableCell>
                <TableCell>Achievements</TableCell>
                <TableCell>Social Platform</TableCell>
                <TableCell>Social Handle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={13} align="center">Loading...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={13} align="center" sx={{ color: 'error.main' }}>{error}</TableCell>
              </TableRow>
            ) : inquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} align="center">No inquiries found</TableCell>
              </TableRow>
            ) : (
              inquiries.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{formatTimestamp(row.createTimestamp)}</TableCell>
                  <TableCell>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => handleCaseDetailClick(row)}
                    >
                      {row.userId ? 'View Case' : 'Create User'}
                    </Button>
                  </TableCell>
                  <TableCell>{row.petitionerEmail}</TableCell>
                  <TableCell>{row.petitionerName}</TableCell>
                  <TableCell>{row.petitionerField}</TableCell>
                  <TableCell>{row.impactBenefits ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{row.impactUsGov ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{row.impactRecognition ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{row.roleVerified ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{row.impactApplied ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{formatAchievements(row)}</TableCell>
                  <TableCell>{row.socialPlatform}</TableCell>
                  <TableCell>{row.socialPlatformOther}</TableCell>
                </TableRow>
              ))
            )}
            </TableBody>
          </Table>
        </TableContainer>

      {/* 创建用户确认对话框 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>创建新用户</DialogTitle>
        <DialogContent>
          <Typography>
            是否要为 {selectedInquiry?.petitionerName} ({selectedInquiry?.petitionerEmail}) 创建新用户？
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button onClick={handleCreateUser} color="primary" variant="contained">
            确认创建
          </Button>
        </DialogActions>
      </Dialog>

      {/* 创建成功对话框 */}
      <Dialog open={showSuccessDialog} onClose={() => setShowSuccessDialog(false)}>
        <DialogTitle>用户创建成功</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            用户已成功创建，请保存以下信息：
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">用户邮箱：</Typography>
            <Typography variant="body1">{userInfo?.email}</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">初始密码：</Typography>
            <Typography variant="body1">{userInfo?.password}</Typography>
          </Box>
          <Typography variant="body2" color="error">
            请务必保存这些信息，初始密码将无法再次查看。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSuccessDialog(false)} color="primary" variant="contained">
            确定
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
  );
} 