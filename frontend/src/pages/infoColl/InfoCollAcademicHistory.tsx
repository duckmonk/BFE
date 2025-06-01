import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Box, Typography, TextField, MenuItem, Snackbar, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import FileUploadButton from '../../components/FileUploadButton';
import { infoCollApi } from '../../services/api';
import { extractFileName } from '../../services/s3Service';
import { countryOptions } from '../../constants/countries';

const degreeOptions = ['Bachelor\'s', 'Master\'s', 'Doctorate', 'Other'];
const statusOptions = ['Completed', 'Ongoing', 'Other'];
const yesNoOptions = ['Yes', 'No'];

interface AcademicHistory {
  id: number;
  clientCaseId: number;
  degree: string;
  schoolName: string;
  status: string;
  startDate: string;
  endDate: string;
  major: string;
  docLanguage: string;
  transcriptsOriginal: string;
  transcriptsTranslated: string;
  diplomaOriginal: string;
  diplomaTranslated: string;
  country: string;
}

interface AcademicHistoryErrors {
  [key: number]: {
    [key: string]: boolean;
  };
}

const InfoCollAcademicHistory = forwardRef(({ clientCaseId, userId }: { clientCaseId: number, userId: string }, ref) => {
  const [academicHistories, setAcademicHistories] = useState<AcademicHistory[]>([]);
  const [errors, setErrors] = useState<AcademicHistoryErrors>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [validationDialog, setValidationDialog] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  useEffect(() => {
    if (clientCaseId) {
      infoCollApi.getAcademicHistory(clientCaseId).then(res => {
        if (res && res.data && Array.isArray(res.data)) {
          setAcademicHistories(res.data);
        }
      }).catch(() => {
        // 可以加错误提示
      });
    }
  }, [clientCaseId]);

  const handleInputChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updatedHistories = [...academicHistories];
    updatedHistories.forEach(history => {
      if (history.id === parseInt(name.split('-')[1])) {
        const field = name.split('-')[0] as keyof AcademicHistory;
        if (field !== 'id' && field !== 'clientCaseId') {
          history[field] = e.target.value;
        }
      }
    });
    setAcademicHistories(updatedHistories);
    // 清除该字段的错误状态
    setErrors(prev => ({
      ...prev,
      [parseInt(name.split('-')[1])]: {
        ...prev[parseInt(name.split('-')[1])],
        [name.split('-')[0]]: false
      }
    }));
  };

  const handleDateChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedHistories = [...academicHistories];
    updatedHistories.forEach(history => {
      if (history.id === parseInt(name.split('-')[1])) {
        const field = name.split('-')[0] as keyof AcademicHistory;
        if (field === 'startDate' || field === 'endDate') {
          history[field] = e.target.value;
        }
      }
    });
    setAcademicHistories(updatedHistories);
    // 清除该字段的错误状态
    setErrors(prev => ({
      ...prev,
      [parseInt(name.split('-')[1])]: {
        ...prev[parseInt(name.split('-')[1])],
        [name.split('-')[0]]: false
      }
    }));
  };

  const handleSelectChange = (index: number, name: string) => (e: any) => {
    const updatedHistories = [...academicHistories];
    updatedHistories[index] = { ...updatedHistories[index], [name]: e.target.value };
    setAcademicHistories(updatedHistories);
    // 清除该字段的错误状态
    setErrors(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [name]: false
      }
    }));
  };

  const handleFileUrlChange = (index: number, name: string, url: string | null) => {
    const updatedHistories = [...academicHistories];
    updatedHistories[index] = { ...updatedHistories[index], [name]: url };
    setAcademicHistories(updatedHistories);
    // 清除该字段的错误状态
    setErrors(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [name]: false
      }
    }));
  };

  const handleAddHistory = () => {
    const newHistory: AcademicHistory = {
      id: Date.now(), // 使用时间戳作为临时ID
      clientCaseId: clientCaseId,
      degree: '',
      schoolName: '',
      status: '',
      startDate: '',
      endDate: '',
      major: '',
      docLanguage: '',
      transcriptsOriginal: '',
      transcriptsTranslated: '',
      diplomaOriginal: '',
      diplomaTranslated: '',
      country: ''
    };
    setAcademicHistories(prev => [...prev, newHistory]);
  };

  const handleDelete = (index: number) => {
    setAcademicHistories(prev => prev.filter((_, i) => i !== index));
    // 删除对应的错误状态
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: AcademicHistoryErrors = {};
    let isValid = true;

    academicHistories.forEach((history, index) => {
      const historyErrors: { [key: string]: boolean } = {};

      // 基本必填字段
      const requiredFields = [
        'degree',
        'schoolName',
        'status',
        'startDate',
        'major',
        'docLanguage',
        'transcriptsOriginal',
        'diplomaOriginal',
        'country'
      ];

      requiredFields.forEach(field => {
        if (!history[field as keyof AcademicHistory]) {
          historyErrors[field] = true;
          isValid = false;
        }
      });

      // 如果状态是 Completed，End Date 必填
      if (history.status === 'Completed' && !history.endDate) {
        historyErrors.endDate = true;
        isValid = false;
      }

      // 如果原始文档不是英文，翻译文件必填
      if (history.docLanguage === 'No') {
        if (!history.transcriptsTranslated) {
          historyErrors.transcriptsTranslated = true;
          isValid = false;
        }
        if (!history.diplomaTranslated) {
          historyErrors.diplomaTranslated = true;
          isValid = false;
        }
      }

      if (Object.keys(historyErrors).length > 0) {
        newErrors[index] = historyErrors;
      }
    });

    setErrors(newErrors);

    if (!isValid) {
      setValidationDialog({
        open: true,
        message: 'Please fill in all required fields and upload required documents.'
      });
    }

    return isValid;
  };

  useImperativeHandle(ref, () => ({
    submit: async () => {
      if (!validateForm()) {
        return;
      }

      try {
        await infoCollApi.submitAcademicHistory(clientCaseId, academicHistories);
        setSnackbar({ open: true, message: 'Successfully saved', severity: 'success' });
      } catch (e: any) {
        setSnackbar({ open: true, message: e?.message || 'Save failed', severity: 'error' });
      }
    }
  }));

  return (
    <Box>
      <Alert severity="warning" sx={{ mb: 2 }}>
        Reminder: If you do not click Save, your changes will be lost.
      </Alert>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Academic History</Typography>

      {academicHistories.map((history, index) => (
        <Box key={index} component="form" noValidate autoComplete="off" sx={{ mb: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>Academic History {index + 1}</Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleDelete(index)}
            >
              Delete
            </Button>
          </Box>

          <TextField 
            label="Respondents (autogenerated)" 
            fullWidth 
            size="small" 
            sx={{ mb: 2 }} 
            InputProps={{ readOnly: true }} 
            value={userId} 
          />

          <TextField
            name={`degree-${history.id}`}
            label="Degree"
            select
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={history.degree || ''}
            onChange={handleSelectChange(index, 'degree')}
            required
            error={errors[index]?.degree}
            helperText={errors[index]?.degree ? 'Degree is required' : ''}
          >
            {degreeOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>

          <TextField
            name={`schoolName-${history.id}`}
            label="School Name"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={history.schoolName || ''}
            onChange={handleInputChange(`schoolName-${history.id}`)}
            required
            error={errors[index]?.schoolName}
            helperText={errors[index]?.schoolName ? 'School Name is required' : ''}
          />

          <TextField
            name={`status-${history.id}`}
            label="Status"
            select
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={history.status || ''}
            onChange={handleSelectChange(index, 'status')}
            required
            error={errors[index]?.status}
            helperText={errors[index]?.status ? 'Status is required' : ''}
          >
            {statusOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>

          <TextField
            name={`startDate-${history.id}`}
            label="Start Date"
            type="date"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            value={history.startDate || ''}
            onChange={handleDateChange(`startDate-${history.id}`)}
            required
            error={errors[index]?.startDate}
            helperText={errors[index]?.startDate ? 'Start Date is required' : ''}
          />

          <TextField
            name={`endDate-${history.id}`}
            label="End Date"
            type="date"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            value={history.endDate || ''}
            onChange={handleDateChange(`endDate-${history.id}`)}
            required={history.status === 'Completed'}
            error={errors[index]?.endDate}
            helperText={errors[index]?.endDate ? 'End Date is required for completed studies' : ''}
          />

          <TextField
            name={`major-${history.id}`}
            label="Major"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={history.major || ''}
            onChange={handleInputChange(`major-${history.id}`)}
            required
            error={errors[index]?.major}
            helperText={errors[index]?.major ? 'Major is required' : ''}
          />

          <TextField
            name={`docLanguage-${history.id}`}
            label="Is your original document in English?"
            select
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={history.docLanguage || ''}
            onChange={handleSelectChange(index, 'docLanguage')}
            required
            error={errors[index]?.docLanguage}
            helperText={errors[index]?.docLanguage ? 'Document language is required' : ''}
          >
            {yesNoOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>

          <FileUploadButton
            label="Upload Copy of Transcripts - Original (PDF)"
            fileType="transcriptsOriginal"
            onFileUrlChange={url => handleFileUrlChange(index, 'transcriptsOriginal', url)}
            required
            error={errors[index]?.transcriptsOriginal}
            fileUrl={history.transcriptsOriginal}
            fileName={history.transcriptsOriginal && extractFileName(history.transcriptsOriginal)}
          />

          {history.docLanguage === 'No' && (
            <FileUploadButton
              label="Upload Copy of Transcripts - Translated (PDF)"
              fileType="transcriptsTranslated"
              onFileUrlChange={url => handleFileUrlChange(index, 'transcriptsTranslated', url)}
              required
              error={errors[index]?.transcriptsTranslated}
              fileUrl={history.transcriptsTranslated}
              fileName={history.transcriptsTranslated && extractFileName(history.transcriptsTranslated)}
            />
          )}

          <FileUploadButton
            label="Upload Copy of Diploma - Original (PDF)"
            fileType="diplomaOriginal"
            onFileUrlChange={url => handleFileUrlChange(index, 'diplomaOriginal', url)}
            required
            error={errors[index]?.diplomaOriginal}
            fileUrl={history.diplomaOriginal}
            fileName={history.diplomaOriginal && extractFileName(history.diplomaOriginal)}
          />

          {history.docLanguage === 'No' && (
            <FileUploadButton
              label="Upload Copy of Diploma - Translated (PDF)"
              fileType="diplomaTranslated"
              onFileUrlChange={url => handleFileUrlChange(index, 'diplomaTranslated', url)}
              required
              error={errors[index]?.diplomaTranslated}
              fileUrl={history.diplomaTranslated}
              fileName={history.diplomaTranslated && extractFileName(history.diplomaTranslated)}
            />
          )}

          <TextField
            name={`country-${history.id}`}
            label="Country"
            select
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={history.country || ''}
            onChange={handleSelectChange(index, 'country')}
            required
            error={errors[index]?.country}
            helperText={errors[index]?.country ? 'Country is required' : ''}
          >
            {countryOptions.map((opt: string) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>
        </Box>
      ))}

      <Button
        variant="contained"
        onClick={handleAddHistory}
        sx={{ mb: 2 }}
      >
        Add Academic History
      </Button>

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

      <Dialog
        open={validationDialog.open}
        onClose={() => setValidationDialog({ open: false, message: '' })}
      >
        <DialogTitle>Validation Error</DialogTitle>
        <DialogContent>
          <Typography>{validationDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setValidationDialog({ open: false, message: '' })}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default InfoCollAcademicHistory; 