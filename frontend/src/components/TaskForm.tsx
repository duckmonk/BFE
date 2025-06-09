import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Snackbar, Alert, TextField, Paper } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { getUserType } from '../utils/user';
import FileUploadButton from './FileUploadButton';
import { AxiosResponse } from 'axios';
import { extractFileName } from '../services/s3Service';

interface TaskFormProps {
  title: string;
  clientCaseId: number;
  initialData?: any;
  draftField: string;
  draftType?: 'text' | 'file';
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
  draftType = 'text',
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

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (additionalData = {}) => {
    try {
      const data = { ...formData, ...additionalData, clientCaseId };
      await onSubmit(data);
      setSnackbar({ open: true, message: 'Successfully saved', severity: 'success' });
      return true;
    } catch (e: any) {
      setSnackbar({ open: true, message: e?.message || 'Save failed', severity: 'error' });
      return false;
    }
  };

  const handleCopy = () => {
    if (formData[feedbackField]) {
      const textToCopy = formData[feedbackField] || '';
      if (navigator.clipboard && window.isSecureContext) {
        // 在安全上下文中使用 Clipboard API
        navigator.clipboard.writeText(textToCopy)
          .catch(() => {
            // 如果 Clipboard API 失败，使用后备方案
            fallbackCopyToClipboard(textToCopy);
          });
      } else {
        // 在不支持 Clipboard API 的环境中使用后备方案
        fallbackCopyToClipboard(textToCopy);
      }
    }
  };

  // 后备复制方案
  const fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // 避免滚动到页面底部
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    try {
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
    } catch (err) {
      console.error('Copy error:', err);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  return (
    <Box component="form" autoComplete="off">
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>{title}</Typography>
      
      {/* Initial Draft */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Initial Draft</Typography>
      <Box sx={{ mb: 2 }}>
        {draftType === 'file' ? (
          <FileUploadButton
            label="Upload Draft (PDF)"
            fileType={draftField}
            fileUrl={formData[draftField] || ''}
            fileName={formData[draftField] && extractFileName(formData[draftField])}
            onFileUrlChange={url => setFormData(prev => ({ ...prev, [draftField]: url }))}
            required
            disableDelete={formData[confirmationField] === 'YES'}
          />
        ) : (
          <TextField
            name={draftField}
            fullWidth
            multiline
            rows={4}
            value={formData[draftField] || ''}
            onChange={handleTextFieldChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        )}
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
            fileName={formData[uploadField] && extractFileName(formData[uploadField])}
            disabled={userType !== 'client'}
            disableDelete={formData[confirmationField] === 'YES'}
          />
        </>
      )}

      {userType === 'client' && formData[confirmationField] !== 'YES' && (
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            if (!formData[feedbackField]?.trim()) {
              setSnackbar({ open: true, message: 'Please fill in the feedback content', severity: 'error' });
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