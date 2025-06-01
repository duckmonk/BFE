import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Grid, TextField, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { inquiryApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import InquiryDetailsModal from '../components/InquiryDetailsModal';
import { clientCaseApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

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
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [dialogErrorMessage, setDialogErrorMessage] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (!['admin', 'marketing_manager', 'lawyer', 'employee'].includes(user.userType)) {
        navigate('/login');
        return;
      }
      fetchInquiries();
    } else {
       // 如果 user 是 null，检查是否正在加载（可选，取决于 AuthContext 实现细节）
       // 如果确定 AuthContext 会在加载完成后设置 user 或 null，这里可以不加额外的 loading 判断
       // 如果 AuthContext 还没有完成初始化，可能需要一个 loading 状态来避免闪烁到登录页
    }
  }, [user, dateStart, dateEnd, navigate]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await inquiryApi.getInquiries({
        dateStart: dateStart ? new Date(dateStart).getTime() / 1000 : undefined,
        dateEnd: dateEnd ? new Date(dateEnd).getTime() / 1000 : undefined,
        userType: user?.userType,
        userId: user?.userId
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

  const handleCaseDetailClick = async (inquiry: Inquiry) => {
    if (inquiry.userId) {
      // 如果已有userId，检查是否有case
      const caseRes = await clientCaseApi.getCaseByUserId(inquiry.userId);
      if (caseRes.status === 'success' && caseRes.caseId) {
        navigate(`/case-details/${caseRes.caseId}`);
      } else {
        // 如果没有case，提示用户
        setDialogErrorMessage('The user has not created a case yet.');
        setShowErrorDialog(true);
      }
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
      alert('Create user failed');
    }
  };

  const handleApplyFilter = async () => {
    try {
      setLoading(true);
      const response = await inquiryApi.getInquiries({
        dateStart: dateStart ? new Date(dateStart).getTime() / 1000 : undefined,
        dateEnd: dateEnd ? new Date(dateEnd).getTime() / 1000 : undefined,
        userType: user?.userType,
        userId: user?.userId
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

  const handleViewDetails = (record: Inquiry) => {
    setSelectedInquiry(record);
    setModalVisible(true);
  };

  const handleSendCalendar = async () => {
    try {
      // TODO: 实现发送日历邀请的逻辑
      alert('Calendar invitation sent successfully!');
    } catch (error) {
      alert('Send failed');
    }
  };

  return (
    <Box sx={{ bgcolor: '#f3f2ee', minHeight: '100vh', display: 'flex', flexDirection: 'column', py: 4 }}>
      <Box sx={{ maxWidth: 1600, mx: 'auto', bgcolor: '#fff', borderRadius: 2, boxShadow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">Marketing Inquiry Dashboard</Typography>
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
        <TableContainer component={Paper} variant="outlined" sx={{ width: '100%', overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">Inquiry Timestamp</TableCell>
                <TableCell align="center">Case Detail</TableCell>
                <TableCell align="center">Petitioner Email</TableCell>
                <TableCell align="center">Petitioner Name</TableCell>
                <TableCell align="center">Petitioner Field</TableCell>
                <TableCell align="center">Work Benefits</TableCell>
                <TableCell align="center">US Gov Projects</TableCell>
                <TableCell align="center">High Impact Projects</TableCell>
                <TableCell align="center">Key Role Verification</TableCell>
                <TableCell align="center">Applied Innovations</TableCell>
                <TableCell align="center">Achievements</TableCell>
                <TableCell align="center">Social Platform</TableCell>
                <TableCell align="center">Social Handle</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={14} align="center">Loading...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={14} align="center" sx={{ color: 'error.main' }}>{error}</TableCell>
                </TableRow>
              ) : inquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} align="center">No inquiries found</TableCell>
                </TableRow>
              ) : (
                inquiries.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="center">{formatTimestamp(row.createTimestamp)}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => handleCaseDetailClick(row)}
                      >
                        {row.userId ? 'View Case' : 'Create User'}
                      </Button>
                    </TableCell>
                    <TableCell align="center">{row.petitionerEmail}</TableCell>
                    <TableCell align="center">{row.petitionerName}</TableCell>
                    <TableCell align="center">{row.petitionerField}</TableCell>
                    <TableCell align="center">{row.impactBenefits ? 'Yes' : 'No'}</TableCell>
                    <TableCell align="center">{row.impactUsGov ? 'Yes' : 'No'}</TableCell>
                    <TableCell align="center">{row.impactRecognition ? 'Yes' : 'No'}</TableCell>
                    <TableCell align="center">{row.roleVerified ? 'Yes' : 'No'}</TableCell>
                    <TableCell align="center">{row.impactApplied ? 'Yes' : 'No'}</TableCell>
                    <TableCell align="center">{formatAchievements(row)}</TableCell>
                    <TableCell align="center">{row.socialPlatform}</TableCell>
                    <TableCell align="center">{row.socialPlatformOther}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => handleViewDetails(row)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Create User Confirmation Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Create New User</DialogTitle>
          <DialogContent>
            <Typography>
              Would you like to create a new user for {selectedInquiry?.petitionerName} ({selectedInquiry?.petitionerEmail})?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateUser} color="primary" variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onClose={() => setShowSuccessDialog(false)}>
          <DialogTitle>User Created Successfully</DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              User has been created successfully. Please save the following information:
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">User Email:</Typography>
              <Typography variant="body1">{userInfo?.email}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Initial Password:</Typography>
              <Typography variant="body1">{userInfo?.password}</Typography>
            </Box>
            <Typography variant="body2" color="error">
              Please make sure to save this information. The initial password cannot be viewed again.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSuccessDialog(false)} color="primary" variant="contained">
              OK
            </Button>
          </DialogActions>
        </Dialog>
        {/* Error Dialog */}
        <Dialog open={showErrorDialog} onClose={() => setShowErrorDialog(false)}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <Typography>{dialogErrorMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowErrorDialog(false)} color="primary" variant="contained">
              OK
            </Button>
          </DialogActions>
        </Dialog>
        <InquiryDetailsModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          data={selectedInquiry}
          onSendCalendar={handleSendCalendar}
        />
      </Box>
    </Box>
  );
} 