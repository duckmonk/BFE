import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { inquiryApi } from '../services/api';
import { addDays, isBefore, startOfDay } from 'date-fns';

const TIME_SLOTS = [
  '10:00-11:00',
  '11:00-12:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
];

const SchedulePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inquiryId = searchParams.get('inquiryId');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!inquiryId) {
      setError('Invalid schedule link');
    }
  }, [inquiryId]);

  const handleTimeSelect = (timeSlot: string) => {
    setSelectedTime(timeSlot);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleSubmit = async () => {
    if (!selectedTime || !selectedDate || !inquiryId) return;

    setLoading(true);
    try {
      // 将时间转换为时间戳
      const [startTime] = selectedTime.split('-');
      const [hours, minutes] = startTime.split(':').map(Number);
      const date = new Date(selectedDate);
      date.setHours(hours, minutes, 0, 0);
      const timestamp = Math.floor(date.getTime() / 1000);

      // 先获取现有数据
      const response = await inquiryApi.getInquiries();
      const existingInquiry = response.data.records.find((inq: any) => inq.id === Number(inquiryId));
      
      if (!existingInquiry) {
        throw new Error('Inquiry not found');
      }

      // 更新数据
      await inquiryApi.update({
        ...existingInquiry,
        sendOutCalendarDateInq: timestamp,
      });

      setSuccess(true);
      // 3秒后跳转到首页
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err: any) {
      console.error('Schedule error:', err);
      setError(err.response?.data?.message || 'Failed to schedule the meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!inquiryId) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            Invalid schedule link
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Schedule NIW Discussion
          </Typography>
          
          <Typography variant="body1" align="center" sx={{ mb: 4 }}>
            Please select your preferred date and time slot
          </Typography>

          <Box sx={{ mb: 4 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={handleDateChange}
                minDate={startOfDay(new Date())}
                maxDate={addDays(new Date(), 14)}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Box>

          <Grid container spacing={2}>
            {TIME_SLOTS.map((timeSlot) => (
              <Grid size={{ xs: 12 }} key={timeSlot}>
                <Button
                  variant={selectedTime === timeSlot ? "contained" : "outlined"}
                  fullWidth
                  onClick={() => handleTimeSelect(timeSlot)}
                  sx={{ py: 1.5 }}
                  disabled={!selectedDate}
                >
                  {timeSlot}
                </Button>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmit}
              disabled={!selectedTime || !selectedDate || loading}
              sx={{ minWidth: 200 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Confirm Schedule'}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success">
          Meeting scheduled successfully! Redirecting...
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SchedulePage; 