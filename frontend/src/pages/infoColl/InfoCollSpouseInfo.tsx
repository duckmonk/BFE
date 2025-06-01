import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Box, Typography, TextField, MenuItem, Snackbar, Alert } from '@mui/material';
import { infoCollApi } from '../../services/api';

const genderOptions = ['Male', 'Female', 'Other'];
const visaOptions = ['Visa Abroad', 'Adjust Status'];

const InfoCollSpouseInfo = forwardRef(({ clientCaseId }: { clientCaseId: number }, ref) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (clientCaseId) {
      infoCollApi.getSpouseInfo(clientCaseId).then(res => {
        if (res && res.data) {
          setFormData(res.data);
        }
      }).catch(() => {
        // 可以加错误提示
      });
    }
  }, [clientCaseId]);

  // 通用输入处理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 下拉选择处理
  const handleSelectChange = (name: string) => (e: any) => {
    setFormData(prev => ({ ...prev, [name]: e.target.value }));
  };

  // 关闭snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    getFormData: () => formData,
    submit: async (clientCase: any) => {
      try {
        const data = { ...formData, clientCaseId: clientCase.clientCaseId };
        await infoCollApi.submitSpouseInfo(data);
        setSnackbar({ open: true, message: '保存成功', severity: 'success' });
      } catch (e: any) {
        setSnackbar({ open: true, message: e?.message || '保存失败', severity: 'error' });
      }
    }
  }));

  return (
    <Box component="form" noValidate autoComplete="off">
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Spouse Info</Typography>
      
      {/* First Name (Spouse) */}
      <TextField
        name="firstName"
        label="First Name (Spouse)"
        fullWidth
        size="small"
        sx={{ mb: 2 }}
        value={formData.firstName || ''}
        onChange={handleChange}
        required
      />

      {/* Middle Name (Spouse) */}
      <TextField
        name="middleName"
        label="Middle Name (Spouse)"
        fullWidth
        size="small"
        sx={{ mb: 2 }}
        value={formData.middleName || ''}
        onChange={handleChange}
      />

      {/* Last Name (Spouse) */}
      <TextField
        name="lastName"
        label="Last Name (Spouse)"
        fullWidth
        size="small"
        sx={{ mb: 2 }}
        value={formData.lastName || ''}
        onChange={handleChange}
        required
      />

      {/* Gender (Spouse) */}
      <TextField
        name="gender"
        label="Gender (Spouse)"
        select
        fullWidth
        size="small"
        sx={{ mb: 2 }}
        value={formData.gender || ''}
        onChange={handleSelectChange('gender')}
        required
      >
        {genderOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
      </TextField>

      {/* Date of Birth (Spouse) */}
      <TextField
        name="dob"
        label="Date of Birth (Spouse)"
        type="date"
        fullWidth
        size="small"
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
        value={formData.dob || ''}
        onChange={handleChange}
        required
      />

      {/* Visa Status */}
      <TextField
        name="visaStatus"
        label="Will he/she apply for a visa abroad or adjust status in the US?"
        select
        fullWidth
        size="small"
        sx={{ mb: 2 }}
        value={formData.visaStatus || ''}
        onChange={handleSelectChange('visaStatus')}
        required
      >
        {visaOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
      </TextField>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
});

export default InfoCollSpouseInfo; 