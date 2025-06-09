import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Box, Typography, TextField, MenuItem, Snackbar, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import FileUploadButton from '../../components/FileUploadButton';
import { infoCollApi } from '../../services/api';
import { extractFileName } from '../../services/s3Service';
import InfoCollAlert from '../../components/InfoCollAlert';

const yesNoOptions = ['Yes', 'No'];

interface EmploymentHistory {
  id?: number;
  clientCaseId: number;
  respondents: string;
  employerName: string;
  currentEmployer: string;
  employerAddress: string;
  placeOfEmployment: string;
  businessType: string;
  jobTitle: string;
  salary: number;
  startDate: string;
  endDate: string;
  hoursPerWeek: number;
  jobSummary: string;
  employerWebsite: string;
  employmentLetter: string;
}

interface EmploymentHistoryErrors {
  [key: number]: {
    [key: string]: boolean;
  };
}

const InfoCollEmploymentHistory = forwardRef(({ clientCaseId, userId, userType }: { clientCaseId: number, userId: string, userType: string }, ref) => {
  const [employmentHistories, setEmploymentHistories] = useState<EmploymentHistory[]>([]);
  const [errors, setErrors] = useState<EmploymentHistoryErrors>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [validationDialog, setValidationDialog] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  useEffect(() => {
    if (clientCaseId) {
      infoCollApi.getEmploymentHistory(clientCaseId).then(res => {
        if (res && res.data && Array.isArray(res.data)) {
          setEmploymentHistories(res.data);
        }
      }).catch(() => {
        // 可以加错误提示
      });
    }
  }, [clientCaseId]);

  const handleChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmploymentHistories(prev => prev.map((history, i) => 
      i === index ? { ...history, [name]: value } : history
    ));
    // 清除该字段的错误状态
    setErrors(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [name]: false
      }
    }));
  };

  const handleSelectChange = (index: number, name: string) => (e: any) => {
    setEmploymentHistories(prev => prev.map((history, i) => 
      i === index ? { ...history, [name]: e.target.value } : history
    ));
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
    setEmploymentHistories(prev => prev.map((history, i) => 
      i === index ? { ...history, [name]: url } : history
    ));
    // 清除该字段的错误状态
    setErrors(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [name]: false
      }
    }));
  };

  const handleAdd = () => {
    setEmploymentHistories(prev => [...prev, {
      clientCaseId,
      respondents: userId,
      employerName: '',
      currentEmployer: '',
      employerAddress: '',
      placeOfEmployment: '',
      businessType: '',
      jobTitle: '',
      salary: 0,
      startDate: '',
      endDate: '',
      hoursPerWeek: 0,
      jobSummary: '',
      employerWebsite: '',
      employmentLetter: ''
    }]);
  };

  const handleDelete = (index: number) => {
    setEmploymentHistories(prev => prev.filter((_, i) => i !== index));
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
    const newErrors: EmploymentHistoryErrors = {};
    let isValid = true;

    employmentHistories.forEach((history, index) => {
      const historyErrors: { [key: string]: boolean } = {};

      // 基本必填字段
      const requiredFields = [
        'employerName',
        'currentEmployer',
        'employerAddress',
        'businessType',
        'jobTitle',
        'salary',
        'startDate',
        'hoursPerWeek',
        'jobSummary',
        'employmentLetter'
      ];

      requiredFields.forEach(field => {
        if (!history[field as keyof EmploymentHistory]) {
          historyErrors[field] = true;
          isValid = false;
        }
      });

      // 如果当前雇主是 No，End Date 必填
      if (history.currentEmployer === 'No' && !history.endDate) {
        historyErrors.endDate = true;
        isValid = false;
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
    getFormData: () => employmentHistories,
    submit: async (clientCase: any) => {
      if (!validateForm()) {
        return false;
      }

      try {
        const historiesWithCaseId = employmentHistories.map(history => ({
          ...history,
          clientCaseId: clientCase?.clientCaseId || clientCaseId,
          respondents: userId
        }));
        await infoCollApi.submitEmploymentHistory(clientCaseId, historiesWithCaseId);
        setSnackbar({ open: true, message: 'Successfully saved', severity: 'success' });
        return true;
      } catch (e: any) {
        setSnackbar({ open: true, message: e?.message || 'Save failed', severity: 'error' });
        return false;
      }
    }
  }));

  return (
    <Box>
      <InfoCollAlert userType={userType} />
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Employment History</Typography>

      {employmentHistories.map((history, index) => (
        <Box key={index} component="form" noValidate autoComplete="off" sx={{ mb: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>Employment History {index + 1}</Typography>
            {userType === 'client' && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDelete(index)}
              >
                Delete
              </Button>
            )}
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
            name="employerName"
            label="Employer Name"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={history.employerName || ''}
            onChange={handleChange(index)}
            required
            error={errors[index]?.employerName}
            helperText={errors[index]?.employerName ? 'Employer Name is required' : ''}
          />

          <TextField
            name="currentEmployer"
            label="Is this your current employer?"
            select
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={history.currentEmployer || ''}
            onChange={handleSelectChange(index, 'currentEmployer')}
            required
            error={errors[index]?.currentEmployer}
            helperText={errors[index]?.currentEmployer ? 'Current employer status is required' : ''}
          >
            {yesNoOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>

          <TextField
            name="employerAddress"
            label="Employer Address"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={history.employerAddress || ''}
            onChange={handleChange(index)}
            required
            error={errors[index]?.employerAddress}
            helperText={errors[index]?.employerAddress ? 'Employer Address is required' : ''}
          />

          <TextField
            name="placeOfEmployment"
            label="Place of Employment (if different)"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={history.placeOfEmployment || ''}
            onChange={handleChange(index)}
          />

          <TextField
            name="businessType"
            label="Type of Business"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={history.businessType || ''}
            onChange={handleChange(index)}
            required
            error={errors[index]?.businessType}
            helperText={errors[index]?.businessType ? 'Type of Business is required' : ''}
          />

          <TextField
            name="jobTitle"
            label="Job Title"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={history.jobTitle || ''}
            onChange={handleChange(index)}
            required
            error={errors[index]?.jobTitle}
            helperText={errors[index]?.jobTitle ? 'Job Title is required' : ''}
          />

          <TextField
            name="salary"
            label="Salary in USD"
            type="number"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={history.salary || ''}
            onChange={handleChange(index)}
            inputProps={{ step: "0.1" }}
            required
            error={errors[index]?.salary}
            helperText={errors[index]?.salary ? 'Salary is required' : ''}
          />

          <TextField
            name="startDate"
            label="Start Date"
            type="date"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            value={history.startDate || ''}
            onChange={handleChange(index)}
            required
            error={errors[index]?.startDate}
            helperText={errors[index]?.startDate ? 'Start Date is required' : ''}
          />

          <TextField
            name="endDate"
            label="End Date"
            type="date"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            value={history.endDate || ''}
            onChange={handleChange(index)}
            required={history.currentEmployer === 'No'}
            error={errors[index]?.endDate}
            helperText={errors[index]?.endDate ? 'End Date is required for non-current employers' : ''}
          />

          <TextField
            name="hoursPerWeek"
            label="Number of Hours Worked Per Week"
            type="number"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={history.hoursPerWeek || ''}
            onChange={handleChange(index)}
            inputProps={{ step: "0.1" }}
            required
            error={errors[index]?.hoursPerWeek}
            helperText={errors[index]?.hoursPerWeek ? 'Hours per week is required' : ''}
          />

          <TextField
            name="jobSummary"
            label="Job Summary"
            multiline
            rows={4}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={history.jobSummary || ''}
            onChange={handleChange(index)}
            required
            error={errors[index]?.jobSummary}
            helperText={errors[index]?.jobSummary ? 'Job Summary is required' : ''}
          />

          <TextField
            name="employerWebsite"
            label="Employer Website"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={history.employerWebsite || ''}
            onChange={handleChange(index)}
          />

          <FileUploadButton
            label="Upload Employment Verification Letter (PDF)"
            fileType="employmentLetter"
            onFileUrlChange={url => handleFileUrlChange(index, 'employmentLetter', url)}
            required
            error={errors[index]?.employmentLetter}
            fileUrl={history.employmentLetter}
            fileName={history.employmentLetter && extractFileName(history.employmentLetter)}
          />
        </Box>
      ))}

      {userType === 'client' && (
        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{ mb: 2 }}
        >
          Add Employment History
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

export default InfoCollEmploymentHistory; 