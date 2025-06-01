import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Box, Typography, TextField, MenuItem, Snackbar, Alert, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { infoCollApi } from '../../services/api';

const genderOptions = ['Male', 'Female', 'Other'];
const visaOptions = ['Visa Abroad', 'Adjust Status'];

interface ChildInfo {
  id?: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  dob: string;
  visaStatus: string;
}

const InfoCollChildrenInfo = forwardRef(({ clientCaseId }: { clientCaseId: number }, ref) => {
  const [children, setChildren] = useState<ChildInfo[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (clientCaseId) {
      infoCollApi.getChildrenInfo(clientCaseId).then(res => {
        if (res && res.data) {
          // 格式化日期
          const formattedData = res.data.map((child: any) => ({
            ...child
            // dob: child.dob ? new Date(child.dob).toISOString().split('T')[0] : ''
          }));
          setChildren(formattedData);
        }
      }).catch(() => {
        // 可以加错误提示
      });
    }
  }, [clientCaseId]);

  // 添加新的子女信息
  const handleAddChild = () => {
    setChildren(prev => [...prev, {
      firstName: '',
      lastName: '',
      gender: '',
      dob: '',
      visaStatus: ''
    }]);
  };

  // 删除子女信息
  const handleDeleteChild = (index: number) => {
    setChildren(prev => prev.filter((_, i) => i !== index));
  };

  // 更新子女信息
  const handleChildChange = (index: number, field: keyof ChildInfo, value: string) => {
    setChildren(prev => prev.map((child, i) => 
      i === index ? { ...child, [field]: value } : child
    ));
  };

  // 关闭snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    getFormData: () => children,
    submit: async (clientCase: any) => {
      try {
        // 为每个 child 加上 clientCaseId
        const childrenWithCaseId = children.map(child => ({
          ...child,
          clientCaseId: clientCase?.clientCaseId || clientCaseId
        }));
        await infoCollApi.submitChildrenInfo(childrenWithCaseId);
        setSnackbar({ open: true, message: '保存成功', severity: 'success' });
      } catch (e: any) {
        setSnackbar({ open: true, message: e?.message || '保存失败', severity: 'error' });
      }
    }
  }));

  return (
    <Box component="form" noValidate autoComplete="off">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>Children Info</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddChild}
          size="small"
        >
          Add Child
        </Button>
      </Box>

      {children.map((child, index) => (
        <Box key={index} sx={{ mb: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, position: 'relative' }}>
          <IconButton
            sx={{ position: 'absolute', right: 8, top: 8 }}
            onClick={() => handleDeleteChild(index)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>

          <Typography variant="subtitle1" sx={{ mb: 2 }}>Child {index + 1}</Typography>

          {/* First Name */}
          <TextField
            label="First Name (Child)"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={child.firstName}
            onChange={(e) => handleChildChange(index, 'firstName', e.target.value)}
            required
          />

          {/* Middle Name */}
          <TextField
            label="Middle Name (Child)"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={child.middleName}
            onChange={(e) => handleChildChange(index, 'middleName', e.target.value)}
          />

          {/* Last Name */}
          <TextField
            label="Last Name (Child)"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={child.lastName}
            onChange={(e) => handleChildChange(index, 'lastName', e.target.value)}
            required
          />

          {/* Gender */}
          <TextField
            label="Gender (Child)"
            select
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={child.gender}
            onChange={(e) => handleChildChange(index, 'gender', e.target.value)}
            required
          >
            {genderOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>

          {/* Date of Birth */}
          <TextField
            label="Date of Birth (Child)"
            type="date"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            value={child.dob}
            onChange={(e) => handleChildChange(index, 'dob', e.target.value)}
            required
          />

          {/* Visa Status */}
          <TextField
            label="Will he/she apply for a visa abroad or adjust status in the US?"
            select
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={child.visaStatus}
            onChange={(e) => handleChildChange(index, 'visaStatus', e.target.value)}
            required
          >
            {visaOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>
        </Box>
      ))}

      {children.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No children added yet. Click "Add Child" to add children information.
        </Typography>
      )}

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

export default InfoCollChildrenInfo; 