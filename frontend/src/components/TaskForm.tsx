import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Snackbar, Alert, TextField } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { getUserType } from '../utils/user';
import ColorfulTextArea from './ColorfulTextArea';
import FileUploadButton from './FileUploadButton';
import { AxiosResponse } from 'axios';

interface TaskFormProps {
  title: string;
  clientCaseId: number;
  initialData?: any;
  draftField: string;
  feedbackField: string;
  confirmationField: string;
  uploadField?: string;
  onSubmit: (data: any) => Promise<AxiosResponse>;
  onFetch: (clientCaseId: number) => Promise<AxiosResponse>;
}

const TaskForm: React.FC<TaskFormProps> = ({
  title,
  clientCaseId,
  initialData,
  draftField,
  feedbackField,
  confirmationField,
  uploadField,
  onSubmit,
  onFetch
}) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>(initialData || {});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const userType = getUserType() || 'admin';

  useEffect(() => {
    if (clientCaseId) {
      onFetch(clientCaseId).then(res => {
        if (res && res.data) {
          setFormData(res.data);
        }
      }).catch(() => {
        // 可以加错误提示
      });
    }
  }, [clientCaseId, onFetch]);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorfulTextAreaChange = (value: string) => {
    setFormData(prev => ({ ...prev, [draftField]: value }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (additionalData = {}) => {
    try {
      const data = { ...formData, ...additionalData, clientCaseId };
      await onSubmit(data);
      setSnackbar({ open: true, message: '保存成功', severity: 'success' });
      return true;
    } catch (e: any) {
      setSnackbar({ open: true, message: e?.message || '保存失败', severity: 'error' });
      return false;
    }
  };

  const handleCopy = () => {
    if (formData[feedbackField]) {
      navigator.clipboard.writeText(formData[feedbackField] || '');
    }
  };

  return (
    <Box component="form" autoComplete="off">
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>{title}</Typography>
      
      {/* Initial Draft */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Initial Draft</Typography>
      <Box sx={{ mb: 2 }}>
        <ColorfulTextArea
          value={formData[draftField] || ''}
          onChange={handleColorfulTextAreaChange}
          userType={userType}
          readOnly={userType === 'client'}
        />
      </Box>

      {userType !== 'client' && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSubmit()}
          sx={{ mb: 3 }}
        >
          Sync with Client
        </Button>
      )}

      {/* Client Feedback */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Client Feedback (Overall)</Typography>
      <TextField
        name={feedbackField}
        fullWidth
        multiline
        rows={4}
        size="small"
        sx={{ mb: 2 }}
        value={formData[feedbackField] || ''}
        onChange={handleTextFieldChange}
        InputProps={{ readOnly: userType !== 'client' }}
      />
      {userType !== 'client' && (
        <Button
          variant="outlined"
          startIcon={<ContentCopyIcon />}
          onClick={handleCopy}
          sx={{ mb: 3 }}
        >
          Copy Feedback
        </Button>
      )}

      {/* File Upload Section */}
      {uploadField && (
        <>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Upload Signed Document</Typography>
          <FileUploadButton
            label="Upload PDF"
            fileType="pdf"
            onUploadSuccess={(url) => setFormData(prev => ({ ...prev, [uploadField]: url }))}
            onUploadError={(error) => setSnackbar({ open: true, message: error, severity: 'error' })}
            onFileUrlChange={(url) => setFormData(prev => ({ ...prev, [uploadField]: url || '' }))}
            accept=".pdf"
            required
            fileUrl={formData[uploadField]}
            fileName={formData[uploadField] ? formData[uploadField].split('/').pop() : ''}
            disabled={userType !== 'client'}
          />
        </>
      )}

      {userType === 'client' && formData[confirmationField] !== 'YES' && (
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            if (!formData[feedbackField]?.trim()) {
              setSnackbar({ open: true, message: '请填写反馈内容', severity: 'error' });
              return;
            }
            const success = await handleSubmit();
            if (success) {
              setFormData(prev => ({ ...prev, [feedbackField]: formData[feedbackField] }));
            }
          }}
          sx={{ mb: 3 }}
        >
          Submit Feedback
        </Button>
      )}

      {/* Client Confirmation */}
      {userType === 'client' && (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={async () => {
            const success = await handleSubmit({ [confirmationField]: 'YES' });
            if (success) {
              setFormData(prev => ({ ...prev, [confirmationField]: 'YES' }));
            }
          }}
          disabled={formData[confirmationField] === 'YES'}
          sx={{ mb: 3 }}
        >
          {formData[confirmationField] === 'YES' ? 'Approved' : 'Approve & Continue'}
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
};

export default TaskForm; 