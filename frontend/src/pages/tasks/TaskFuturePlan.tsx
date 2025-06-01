import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Box, Typography, TextField, Button, Snackbar, Alert, MenuItem } from '@mui/material';
import { infoCollApi, taskApi } from '../../services/api';
import { getUserType } from '../../utils/user';
import ColorfulTextArea from '../../components/ColorfulTextArea';

interface TaskFuturePlan {
  id?: number;
  clientCaseId: number;
  futureplanDraft: string;
  futureplanShort: string;
  futureplanLong: string;
  futureplanReferees: string[];
  futureplanRefereeNotes: { [key: string]: string };
  futureplanFeedback: string;
  futureplanSubmitDraft: string;
  futureplanConfirm: string;
}

interface Recommender {
  name: string;
}

const TaskFuturePlan = forwardRef(({ clientCaseId }: { clientCaseId: number }, ref) => {
  const [formData, setFormData] = useState<TaskFuturePlan>({
    clientCaseId,
    futureplanDraft: '',
    futureplanShort: '',
    futureplanLong: '',
    futureplanReferees: [],
    futureplanRefereeNotes: {},
    futureplanFeedback: '',
    futureplanSubmitDraft: '',
    futureplanConfirm: ''
  });
  const [recommenders, setRecommenders] = useState<Recommender[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const userType = getUserType() || 'admin';

  useEffect(() => {
    if (clientCaseId) {
      taskApi.getFuturePlan(clientCaseId).then(res => {
        if (res && res.data) {
          setFormData(res.data);
        }
      }).catch(() => {
        // 可以加错误提示
      });

      infoCollApi.getRecommenderNames(clientCaseId).then(res => {
        if (res && res.data && res.data.recommenders) {
          setRecommenders(res.data.recommenders);
        }
      }).catch(() => {
        // 可以加错误提示
      });
    }
  }, [clientCaseId]);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorfulTextAreaChange = (value: string) => {
    setFormData(prev => ({ ...prev, futureplanDraft: value }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmitDraft = async () => {
    try {
      const data = { 
        ...formData, 
        futureplanSubmitDraft: 'YES',
        clientCaseId,
        id: formData.id
      };
      await taskApi.submitFuturePlan(data);
      setFormData(prev => ({ ...prev, futureplanSubmitDraft: 'YES' }));
      setSnackbar({ open: true, message: '提交成功', severity: 'success' });
    } catch (e: any) {
      setSnackbar({ open: true, message: e?.message || '提交失败', severity: 'error' });
    }
  };

  const handleConfirm = async () => {
    try {
      const data = { 
        ...formData, 
        futureplanConfirm: 'YES',
        clientCaseId,
        id: formData.id
      };
      await taskApi.submitFuturePlan(data);
      setFormData(prev => ({ ...prev, futureplanConfirm: 'YES' }));
      setSnackbar({ open: true, message: '确认成功', severity: 'success' });
    } catch (e: any) {
      setSnackbar({ open: true, message: e?.message || '确认失败', severity: 'error' });
    }
  };

  const handleRefereeNoteChange = (refereeName: string, note: string) => {
    setFormData(prev => ({
      ...prev,
      futureplanRefereeNotes: {
        ...prev.futureplanRefereeNotes,
        [refereeName]: note
      }
    }));
  };

  useImperativeHandle(ref, () => ({
    getFormData: () => formData,
    submit: async (clientCase: any) => {
      try {
        const data = { ...formData, clientCaseId: clientCase.clientCaseId };
        await taskApi.submitFuturePlan(data);
        setSnackbar({ open: true, message: '保存成功', severity: 'success' });
      } catch (e: any) {
        setSnackbar({ open: true, message: e?.message || '保存失败', severity: 'error' });
      }
    }
  }));

  return (
    <Box component="form" autoComplete="off">
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Future Plan</Typography>
      
      {/* Future Plan Overview */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Future Plan Overview</Typography>
      <Box sx={{ mb: 2 }}>
        <ColorfulTextArea
          value={formData.futureplanDraft || ''}
          onChange={handleColorfulTextAreaChange}
          userType={userType}
        />
      </Box>

      {/* Short-Term Plan */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Short-Term Plan</Typography>
      <TextField
        name="futureplanShort"
        fullWidth
        multiline
        rows={4}
        size="small"
        sx={{ mb: 2 }}
        value={formData.futureplanShort || ''}
        onChange={handleTextFieldChange}
        required
      />

      {/* Long-Term Plan */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Long-Term Plan</Typography>
      <TextField
        name="futureplanLong"
        fullWidth
        multiline
        rows={4}
        size="small"
        sx={{ mb: 2 }}
        value={formData.futureplanLong || ''}
        onChange={handleTextFieldChange}
        required
      />

      {/* Link Referee to Future Plan Sections */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Link Referee to Future Plan Sections</Typography>
      <TextField
        name="futureplanReferees"
        select
        fullWidth
        size="small"
        sx={{ mb: 2 }}
        value={formData.futureplanReferees || []}
        onChange={handleTextFieldChange}
        SelectProps={{
          multiple: true
        }}
      >
        {recommenders.map((recommender) => (
          <MenuItem key={recommender.name} value={recommender.name}>
            {recommender.name}
          </MenuItem>
        ))}
      </TextField>

      {/* Referee Support Notes */}
      {(formData.futureplanReferees || []).map((refereeName) => (
        <Box key={refereeName} sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Support Note for {refereeName}</Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            size="small"
            value={formData.futureplanRefereeNotes[refereeName] || ''}
            onChange={(e) => handleRefereeNoteChange(refereeName, e.target.value)}
            placeholder="Enter support note for this referee..."
          />
        </Box>
      ))}

      {/* Our Overall Feedback */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Our Overall Feedback</Typography>
      <TextField
        name="futureplanFeedback"
        fullWidth
        multiline
        rows={4}
        size="small"
        sx={{ mb: 2 }}
        value={formData.futureplanFeedback || ''}
        onChange={handleTextFieldChange}
      />

      {/* Submit Draft for Review */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmitDraft}
        disabled={formData.futureplanSubmitDraft === 'YES'}
        sx={{ mb: 3 }}
      >
        {formData.futureplanSubmitDraft === 'YES' ? 'Submitted' : 'Submit for Review'}
      </Button>

      {/* Confirm & Move to Next Step */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleConfirm}
        disabled={formData.futureplanConfirm === 'YES'}
        sx={{ mb: 3 }}
      >
        {formData.futureplanConfirm === 'YES' ? 'Approved' : 'Approve & Continue'}
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
    </Box>
  );
});

export default TaskFuturePlan; 