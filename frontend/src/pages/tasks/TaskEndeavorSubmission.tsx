import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Box, Typography, TextField, FormControlLabel, Checkbox, Snackbar, Alert, Button, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { infoCollApi, taskApi } from '../../services/api';
import { getUserType } from '../../utils/user';

const TaskEndeavorSubmission = forwardRef(({ clientCaseId }: { clientCaseId: number }, ref) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const userType = getUserType();

  const isApproved = userType === 'client' && formData.endeavorConfirm === 'YES';

  useEffect(() => {
    if (clientCaseId) {
      taskApi.getEndeavorSubmission(clientCaseId).then(res => {
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

  // 复选框处理
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked ? 'YES' : 'NO' }));
  };

  // 关闭snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // 同步到客户端
  const handleSync = async () => {
    try {
      const data = { ...formData, clientCaseId };
      await taskApi.submitEndeavorSubmission(data);
      setSnackbar({ open: true, message: '同步成功', severity: 'success' });
    } catch (e: any) {
      setSnackbar({ open: true, message: e?.message || '同步失败', severity: 'error' });
    }
  };

  // 复制内容
  const handleCopy = () => {
    if (formData.endeavorFeedback) {
      navigator.clipboard.writeText(formData.endeavorFeedback);
      setSnackbar({ open: true, message: '复制成功', severity: 'success' });
    }
  };

  // client端提交反馈
  const handleSubmitFeedback = async () => {
    try {
      const data = { ...formData, clientCaseId, endeavorConfirm: 'NO' };
      await taskApi.submitEndeavorSubmission(data);
      setSnackbar({ open: true, message: '反馈已提交', severity: 'success' });
    } catch (e: any) {
      setSnackbar({ open: true, message: e?.message || '提交失败', severity: 'error' });
    }
  };

  // client端approve
  const handleApprove = async () => {
    try {
      const data = { ...formData, clientCaseId, endeavorConfirm: 'YES' };
      await taskApi.submitEndeavorSubmission(data);
      setSnackbar({ open: true, message: '已确认', severity: 'success' });
    } catch (e: any) {
      setSnackbar({ open: true, message: e?.message || '提交失败', severity: 'error' });
    }
  };

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    getFormData: () => formData,
    submit: async (clientCase: any) => {
      try {
        const data = { ...formData, clientCaseId: clientCase.clientCaseId };
        await taskApi.submitEndeavorSubmission(data);
        setSnackbar({ open: true, message: '保存成功', severity: 'success' });
      } catch (e: any) {
        setSnackbar({ open: true, message: e?.message || '保存失败', severity: 'error' });
      }
    }
  }));

  return (
    <Box component="form" autoComplete="off">
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Endeavor Submission</Typography>
      
      {/* Initial Draft Preview */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Initial Draft Preview</Typography>
      <TextField
        name="endeavorDraft"
        fullWidth
        multiline
        rows={6}
        size="small"
        sx={{ mb: 2 }}
        value={formData.endeavorDraft || ''}
        required
        onChange={handleChange}
        InputProps={{ readOnly: isApproved || userType === 'client' }}
      />
      {userType !== 'client' && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSync}
          sx={{ mb: 3 }}
        >
          Sync with Client
        </Button>
      )}

      {/* Client Feedback */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Client Feedback</Typography>
      <TextField
        name="endeavorFeedback"
        fullWidth
        multiline
        rows={4}
        size="small"
        sx={{ mb: 2 }}
        value={formData.endeavorFeedback || ''}
        onChange={handleChange}
        InputProps={{ readOnly: isApproved }}
      />
      {userType === 'client' && !isApproved && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitFeedback}
          sx={{ mb: 3 }}
        >
          提交反馈
        </Button>
      )}

      {/* Client Confirmation */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Client Confirmation</Typography>
      <FormControlLabel
        control={
          <Checkbox
            name="endeavorConfirm"
            checked={formData.endeavorConfirm === 'YES'}
            onChange={handleCheckboxChange}
            required
            disabled={isApproved}
          />
        }
        label="I approve this final version"
      />
      {formData.endeavorConfirm === 'NO' && (
        <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
          (Uncheck: I request further changes)
        </Typography>
      )}

      {/* Final Version of Endeavor - 仅在确认后显示 */}
      {formData.endeavorConfirm === 'YES' && (
        <>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3, mb: 1 }}>Final Version of Endeavor</Typography>
          <TextField
            name="endeavorFinal"
            fullWidth
            multiline
            rows={6}
            size="small"
            sx={{ mb: 3 }}
            InputProps={{ readOnly: true }}
            value={formData.endeavorDraft || ''} // 使用 endeavorDraft 的内容
            required
          />
        </>
      )}
      {/* client端勾选后出现Approve按钮 */}
      {userType === 'client' && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleApprove}
          sx={{ mb: 3, mt: 4 }}
          disabled={isApproved}
        >
          {isApproved ? '已确认' : 'Approve'}
        </Button>
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

export default TaskEndeavorSubmission; 