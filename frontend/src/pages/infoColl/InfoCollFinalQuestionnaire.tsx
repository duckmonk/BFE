import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Box, Typography, TextField, MenuItem, Snackbar, Alert, Accordion, AccordionSummary, AccordionDetails, FormControlLabel, Checkbox } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { infoCollApi } from '../../services/api';
import FileUploadButton from '../../components/FileUploadButton';

const changeOptions = [
  'Passport Information',
  'Current Address',
  'Current Employer',
  'Work Address',
  'I-94 Information',
  'Other Immigration Applications',
  'Marital Status',
  'Children'
];

interface FinalQuestionnaire {
  id?: number;
  clientCaseId: number;
  respondents: string;
  changesSelected: string[];
  passportChanges: string;
  passportDocuments: string;
  addressChanges: string;
  employerChanges: string;
  i94Changes: string;
  i94Documents: string;
  marriageStatus: string;
  spouseSubmission: string;
  childrenStatus: string;
  childrenSubmission: string;
  immigrationUpdates: string;
  immigrationDocuments: string;
}

const InfoCollFinalQuestionnaire = forwardRef(({ clientCaseId }: { clientCaseId: number }, ref) => {
  const [formData, setFormData] = useState<FinalQuestionnaire>({
    clientCaseId,
    respondents: '',
    changesSelected: [],
    passportChanges: '',
    passportDocuments: '',
    addressChanges: '',
    employerChanges: '',
    i94Changes: '',
    i94Documents: '',
    marriageStatus: '',
    spouseSubmission: '',
    childrenStatus: '',
    childrenSubmission: '',
    immigrationUpdates: '',
    immigrationDocuments: ''
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (clientCaseId) {
      infoCollApi.getFinalQuestionnaire(clientCaseId).then((res: { data: any }) => {
        if (res && res.data) {
          // 确保 changesSelected 是数组
          const data = {
            ...res.data,
            changesSelected: Array.isArray(res.data.changesSelected) ? res.data.changesSelected : []
          };
          setFormData(data);
        }
      }).catch(() => {
        // 可以加错误提示
      });
    }
  }, [clientCaseId]);

  const handleChange = (field: keyof FinalQuestionnaire, value: any) => {
    if (field === 'changesSelected') {
      // 确保 value 是数组
      const selectedValues = Array.isArray(value) ? value : [];
      setFormData(prev => ({ ...prev, [field]: selectedValues }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useImperativeHandle(ref, () => ({
    getFormData: () => formData,
    submit: async (clientCase: any) => {
      try {
        const data = { ...formData, clientCaseId: clientCase.clientCaseId };
        const response = await infoCollApi.submitFinalQuestionnaire(data);
        if (response.data) {
          setFormData(response.data);
        }
        setSnackbar({ open: true, message: '保存成功', severity: 'success' });
      } catch (e: any) {
        setSnackbar({ open: true, message: e?.message || '保存失败', severity: 'error' });
      }
    }
  }));

  return (
    <Box component="form" noValidate autoComplete="off">
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Final Questionnaire</Typography>

      <TextField
        label="Respondents"
        fullWidth
        size="small"
        sx={{ mb: 2 }}
        value={formData.respondents}
        onChange={(e) => handleChange('respondents', e.target.value)}
        required
      />

      <TextField
        label="Have any of the following items changed since your last submission?"
        select
        fullWidth
        size="small"
        sx={{ mb: 2 }}
        value={formData.changesSelected || []}
        onChange={(e) => handleChange('changesSelected', e.target.value)}
        required
        SelectProps={{
          multiple: true,
          value: formData.changesSelected || []
        }}
      >
        {changeOptions.map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      {formData.changesSelected?.includes('Passport Information') && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Passport Information Changes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              label="What changes have occurred to your passport information?"
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              value={formData.passportChanges}
              onChange={(e) => handleChange('passportChanges', e.target.value)}
              required
              multiline
              rows={2}
            />
            <FileUploadButton
              label="Please upload any relevant documents related to your updated passport information"
              fileType="passportDocuments"
              onFileUrlChange={(url: string | null) => handleChange('passportDocuments', url || '')}
              required
              fileUrl={formData.passportDocuments}
              fileName={formData.passportDocuments && formData.passportDocuments.split('/').pop()}
            />
          </AccordionDetails>
        </Accordion>
      )}

      {formData.changesSelected?.includes('Current Address') && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Current Address Changes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              label="What changes have occurred to your current address?"
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              value={formData.addressChanges}
              onChange={(e) => handleChange('addressChanges', e.target.value)}
              required
              multiline
              rows={2}
            />
          </AccordionDetails>
        </Accordion>
      )}

      {formData.changesSelected?.includes('Current Employer') && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Current Employer Changes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              label="What changes have occurred to your current employer and/or work address?"
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              value={formData.employerChanges}
              onChange={(e) => handleChange('employerChanges', e.target.value)}
              required
              multiline
              rows={2}
            />
          </AccordionDetails>
        </Accordion>
      )}

      {formData.changesSelected?.includes('I-94 Information') && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>I-94 Information Changes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              label="What changes have occurred to your I-94 information?"
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              value={formData.i94Changes}
              onChange={(e) => handleChange('i94Changes', e.target.value)}
              required
              multiline
              rows={2}
            />
            <FileUploadButton
              label="Please upload any relevant documents related to your updated I-94 information"
              fileType="i94Documents"
              onFileUrlChange={(url: string | null) => handleChange('i94Documents', url || '')}
              required
              fileUrl={formData.i94Documents}
              fileName={formData.i94Documents && formData.i94Documents.split('/').pop()}
            />
          </AccordionDetails>
        </Accordion>
      )}

      {formData.changesSelected?.includes('Marital Status') && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Marital Status Changes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              label="Have you recently gotten married?"
              select
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              value={formData.marriageStatus}
              onChange={(e) => handleChange('marriageStatus', e.target.value)}
              required
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>
            {formData.marriageStatus === 'Yes' && (
              <Typography color="primary" sx={{ mb: 2 }}>
                Please submit spouse information in the Spouse Information Form
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      )}

      {formData.changesSelected?.includes('Children') && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Children Changes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              label="Have you recently had a child?"
              select
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              value={formData.childrenStatus}
              onChange={(e) => handleChange('childrenStatus', e.target.value)}
              required
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>
            {formData.childrenStatus === 'Yes' && (
              <Typography color="primary" sx={{ mb: 2 }}>
                Please submit child information in the Children Information Form
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      )}

      {formData.changesSelected?.includes('Other Immigration Applications') && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Other Immigration Applications Changes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              label="What updates have occurred regarding your other immigration applications?"
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              value={formData.immigrationUpdates}
              onChange={(e) => handleChange('immigrationUpdates', e.target.value)}
              required
              multiline
              rows={2}
            />
            <FileUploadButton
              label="Please upload any relevant documents related to the updates in your other immigration applications"
              fileType="immigrationDocuments"
              onFileUrlChange={(url: string | null) => handleChange('immigrationDocuments', url || '')}
              required
              fileUrl={formData.immigrationDocuments}
              fileName={formData.immigrationDocuments && formData.immigrationDocuments.split('/').pop()}
            />
          </AccordionDetails>
        </Accordion>
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

export default InfoCollFinalQuestionnaire; 