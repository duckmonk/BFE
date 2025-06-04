import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import moment from 'moment';
import { userApi, inquiryApi } from '../services/api'; // Import userApi and inquiryApi
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

interface InquiryDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  data: any;
  onSendCalendar: () => void;
}

const InquiryDetailsModal: React.FC<InquiryDetailsModalProps> = ({
  visible,
  onClose,
  data,
  onSendCalendar,
}) => {
  const [formData, setFormData] = useState<any>({});
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loadingLawyers, setLoadingLawyers] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [lawyerError, setLawyerError] = useState<string | null>(null);
  const [employeeError, setEmployeeError] = useState<string | null>(null);
  const { user } = useAuth(); // Get the current user from AuthContext

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setLoadingLawyers(true);
        const response = await userApi.getLawyers();
        setLawyers(response.data);
        setLawyerError(null);
      } catch (err: any) {
        console.error('Error fetching lawyers:', err);
        setLawyerError(err.message || 'Failed to load lawyers.');
        setLawyers([]);
      } finally {
        setLoadingLawyers(false);
      }
    };

    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const response = await userApi.getEmployees();
        setEmployees(response.data);
        setEmployeeError(null);
      } catch (err: any) {
        console.error('Error fetching employees:', err);
        setEmployeeError(err.message || 'Failed to load employees.');
        setEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    };

    if (visible) {
      fetchLawyers();
      fetchEmployees();
    }
  }, [visible]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => {
      const newData = { ...prev, [field]: value };

      // Calculate total price if any of the payment fields change
      if (['firstPaymentInq', 'secondPaymentInq', 'thirdPaymentInq'].includes(field)) {
        const first = parseFloat(newData.firstPaymentInq) || 0;
        const second = parseFloat(newData.secondPaymentInq) || 0;
        const third = parseFloat(newData.thirdPaymentInq) || 0;
        newData.totalPriceInq = (first + second + third).toFixed(2); // Keep two decimal places
      }

      // If the selected field is the attorney select, update firm name
      if (field === 'bfeSendOutAttorneyInq') {
        const selectedLawyer = lawyers.find(lawyer => lawyer.id === parseInt(value));
        if (selectedLawyer) {
          newData.attorneyFirmInq = selectedLawyer.firmName || ''; // Set firm name
        } else {
          newData.attorneyFirmInq = ''; // Clear if no lawyer selected or found
        }
      }

      // If attorney approval button changes to true, set timestamp
      if (field === 'attorneyApprovedButton' && value === true && prev.attorneyApprovedButton !== true) {
        newData.attorneyApprovedTsInq = Math.floor(Date.now() / 1000); // Current timestamp in seconds
      }

      return newData;
    });
  };

  const handleSave = async () => {
    try {
      // Call the inquiry update API
      const response = await inquiryApi.update(formData);
      // Assuming the API returns a success status or similar
      if (response.status === 200) { // Adjust based on actual backend success response
        // Close modal on success
        onClose();
        // Optionally, show a success message
        // alert('Inquiry saved successfully!');
      } else {
        // Handle save error (e.g., show an error message)
        console.error('Failed to save inquiry:', response.data?.message);
        alert('Failed to save inquiry.' + response.data?.message);
      }
    } catch (error: any) {
      console.error('Error saving inquiry:', error);
      alert('An error occurred while saving inquiry: ' + error.message);
    }
  };

  const handleCopyCalendarUrl = () => {
    const calendarUrl = `${window.location.origin}/schedule?inquiryId=${formData.id}`;
    navigator.clipboard.writeText(calendarUrl).then(() => {
      setShowCopiedAlert(true);
    });
  };

  const formatTimestamp = (timestamp: number) => {
    return timestamp ? moment.unix(timestamp).format('YYYY-MM-DD HH:mm:ss') : '';
  };

  // Helper function to determine if a field should be disabled
  const isFieldDisabled = (fieldName: string, currentUserType: string | undefined): boolean => {
    // Auto-generated fields are always disabled
    const autoGeneratedFields = [
      'totalPriceInq',
      'bfeApprovedTsInq', // Timestamp for BFE approval
      'attorneyApprovedTsInq', // Timestamp for Attorney approval
      'attorneyFirmInq', // Auto-filled from attorney selection
    ];
    if (autoGeneratedFields.includes(fieldName)) {
      return true;
    }

    switch (currentUserType) {
      case 'admin':
        // Admin can edit everything except auto-generated
        return false; // Already handled auto-generated above
      case 'marketing_manager':
        // Marketing Manager can edit all except auto-generated AND restricted fields
        return ['attorneyApprovedButton', 'caseStatusBfeInq'].includes(fieldName);
      case 'lawyer':
        // Lawyer can only edit attorneyApprovedButton
        return fieldName !== 'attorneyApprovedButton';
      case 'employee':
        // Employee can edit most fields except restricted ones
        return fieldName !== 'caseStatusBfeInq';
      default:
        // Other user types (client, etc.) cannot edit
        return true;
    }
  };

  return (
    <>
      <Dialog
        open={visible}
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Case Details</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Social Media */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="What is your social media handle?"
                value={formData?.socialHandleInq || ''}
                onChange={(e) => handleChange('socialHandleInq', e.target.value)}
                disabled={isFieldDisabled('socialHandleInq', user?.userType)}
              />
            </Grid>

            {/* NIW Score */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="What is the NIW evaluation score?"
                type="number"
                value={formData?.niwScoreInq || ''}
                onChange={(e) => handleChange('niwScoreInq', e.target.value)}
                disabled={isFieldDisabled('niwScoreInq', user?.userType)}
              />
            </Grid>

            {/* Calendar Related */}
            <Grid size={{ xs: 12, md: 6 }}>
              {formData?.sendOutCalendarDateInq ? (
                <TextField
                  fullWidth
                  label="When is the scheduled NIW discussion?"
                  value={formatTimestamp(formData.sendOutCalendarDateInq)}
                  disabled
                />
              ) : (
                <Button
                  variant="contained"
                  onClick={handleCopyCalendarUrl}
                  fullWidth
                  disabled={isFieldDisabled('sendOutCalendarDateInq', user?.userType)}
                >
                  Copy Schedule Link
                </Button>
              )}
            </Grid>

            {/* Price Related */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="What is the total service price?"
                type="number"
                value={formData?.totalPriceInq || ''}
                disabled
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="What is the first payment amount?"
                type="number"
                value={formData?.firstPaymentInq || ''}
                onChange={(e) => handleChange('firstPaymentInq', e.target.value)}
                disabled={isFieldDisabled('firstPaymentInq', user?.userType)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="What is the second payment amount?"
                type="number"
                value={formData?.secondPaymentInq || ''}
                onChange={(e) => handleChange('secondPaymentInq', e.target.value)}
                disabled={isFieldDisabled('secondPaymentInq', user?.userType)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="What is the occasion of the second payment?"
                value={formData?.secondPaymentNoteInq || ''}
                onChange={(e) => handleChange('secondPaymentNoteInq', e.target.value)}
                disabled={isFieldDisabled('secondPaymentNoteInq', user?.userType)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="What is the third payment amount?"
                type="number"
                value={formData?.thirdPaymentInq || ''}
                onChange={(e) => handleChange('thirdPaymentInq', e.target.value)}
                disabled={isFieldDisabled('thirdPaymentInq', user?.userType)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="What is the occasion of the third payment?"
                value={formData?.thirdPaymentNoteInq || ''}
                onChange={(e) => handleChange('thirdPaymentNoteInq', e.target.value)}
                disabled={isFieldDisabled('thirdPaymentNoteInq', user?.userType)}
              />
            </Grid>

            {/* BFE Approval Related */}
            {/* <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData?.bfeApprovedButton || false}
                    disabled={isFieldDisabled('bfeApprovedButton', user?.userType)}
                    onChange={(e) => handleChange('bfeApprovedButton', e.target.checked)}
                  />
                }
                label="Has BFE approval been granted?"
              />
            </Grid> */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="When was BFE approval granted?"
                value={formatTimestamp(formData?.bfeApprovedTsInq)}
                disabled
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth disabled={isFieldDisabled('bfeSendOutAttorneyInq', user?.userType)}>
                <InputLabel>Send out to which attorney</InputLabel>
                <Select
                  value={formData?.bfeSendOutAttorneyInq || ''}
                  label="Send out to which attorney"
                  onChange={(e) => handleChange('bfeSendOutAttorneyInq', e.target.value)}
                  disabled={loadingLawyers || !!lawyerError || isFieldDisabled('bfeSendOutAttorneyInq', user?.userType)}
                >
                  {loadingLawyers && <MenuItem disabled>Loading...</MenuItem>}
                  {lawyerError && <MenuItem disabled>Error loading lawyers</MenuItem>}
                  {!loadingLawyers && !lawyerError && lawyers.map((lawyer) => (
                    <MenuItem key={lawyer.id} value={lawyer.id}>
                      {lawyer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Attorney Approval Related */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData?.attorneyApprovedButton || false}
                    disabled={isFieldDisabled('attorneyApprovedButton', user?.userType)}
                    onChange={(e) => handleChange('attorneyApprovedButton', e.target.checked)}
                  />
                }
                label="Has attorney approval been granted?"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="When did the attorney approve the case?"
                value={formatTimestamp(formData?.attorneyApprovedTsInq)}
                disabled
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="What is the attorney's firm name?"
                value={formData?.attorneyFirmInq || ''}
                disabled
              />
            </Grid>

            {/* Case Management Related */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth disabled={isFieldDisabled('pocInq', user?.userType)}>
                <InputLabel>Who is the case manager for this case</InputLabel>
                <Select
                  value={formData?.pocInq || ''}
                  label="Who is the case manager for this case"
                  onChange={(e) => handleChange('pocInq', e.target.value)}
                  disabled={loadingEmployees || !!employeeError || isFieldDisabled('pocInq', user?.userType)}
                >
                  {loadingEmployees && <MenuItem disabled>Loading...</MenuItem>}
                  {employeeError && <MenuItem disabled>Error loading employees</MenuItem>}
                  {!loadingEmployees && !employeeError && employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth disabled={isFieldDisabled('reviewerInq', user?.userType)}>
                <InputLabel>Who is the supervisor for this case</InputLabel>
                <Select
                  value={formData?.reviewerInq || ''}
                  label="Who is the supervisor for this case"
                  onChange={(e) => handleChange('reviewerInq', e.target.value)}
                  disabled={loadingEmployees || !!employeeError || isFieldDisabled('reviewerInq', user?.userType)}
                >
                  {loadingEmployees && <MenuItem disabled>Loading...</MenuItem>}
                  {employeeError && <MenuItem disabled>Error loading employees</MenuItem>}
                  {!loadingEmployees && !employeeError && employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth disabled={isFieldDisabled('caseStatusBfeInq', user?.userType)}>
                <InputLabel>What is the current case status</InputLabel>
                <Select
                  value={formData?.caseStatusBfeInq || ''}
                  label="What is the current case status"
                  onChange={(e) => handleChange('caseStatusBfeInq', e.target.value)}
                  disabled={isFieldDisabled('caseStatusBfeInq', user?.userType)}
                >
                  <MenuItem value="OPEN">OPEN</MenuItem>
                  <MenuItem value="CLOSED">CLOSED</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="The execution of the case"
                multiline
                rows={4}
                value={formData?.caseDetails || ''}
                onChange={(e) => handleChange('caseDetails', e.target.value)}
                disabled={isFieldDisabled('caseDetails', user?.userType)}
              />
            </Grid>

            {/* USCIS Related */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="USCIS Case Number"
                value={formData?.caseUscisNumInq || ''}
                onChange={(e) => handleChange('caseUscisNumInq', e.target.value)}
                disabled={isFieldDisabled('caseUscisNumInq', user?.userType)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth disabled={isFieldDisabled('caseUscisCenterInq', user?.userType)}>
                <InputLabel>USCIS Processing Center</InputLabel>
                <Select
                  value={formData?.caseUscisCenterInq || ''}
                  label="USCIS Processing Center"
                  onChange={(e) => handleChange('caseUscisCenterInq', e.target.value)}
                  disabled={isFieldDisabled('caseUscisCenterInq', user?.userType)}
                >
                  <MenuItem value="CSC">California Service Center (CSC)</MenuItem>
                  <MenuItem value="NSC">Nebraska Service Center (NSC)</MenuItem>
                  <MenuItem value="TSC">Texas Service Center (TSC)</MenuItem>
                  <MenuItem value="VSC">Vermont Service Center (VSC)</MenuItem>
                  <MenuItem value="PSC">Potomac Service Center (PSC)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="USCIS Case Reviewer"
                value={formData?.caseUscisReviewerInq || ''}
                onChange={(e) => handleChange('caseUscisReviewerInq', e.target.value)}
                disabled={isFieldDisabled('caseUscisReviewerInq', user?.userType)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth disabled={isFieldDisabled('caseUscisResultInq', user?.userType)}>
                <InputLabel>USCIS Case Result</InputLabel>
                <Select
                  value={formData?.caseUscisResultInq || ''}
                  label="USCIS Case Result"
                  onChange={(e) => handleChange('caseUscisResultInq', e.target.value)}
                  disabled={isFieldDisabled('caseUscisResultInq', user?.userType)}
                >
                  <MenuItem value="Before Filling">Before Filling</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approval">Approval</MenuItem>
                  <MenuItem value="Rejection">Rejection</MenuItem>
                  <MenuItem value="Withdraw">Withdraw</MenuItem>
                  <MenuItem value="RFE">RFE</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showCopiedAlert}
        autoHideDuration={3000}
        onClose={() => setShowCopiedAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowCopiedAlert(false)} severity="success">
          Schedule link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default InquiryDetailsModal; 