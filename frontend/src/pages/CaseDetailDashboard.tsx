import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Grid, TextField, Button } from '@mui/material';
import { clientCaseApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TaskStatus {
  endeavor_submission: boolean;
  national_importance: boolean;
  future_plan: boolean;
  substantial_merits: boolean;
  recommendation_letters: boolean;
  well_positioned: boolean;
  balancing_factors: boolean;
}

interface Case {
  id: number;
  createTimestamp: number;
  userName: string;
  userEmail: string;
  [key: string]: any; // 用于存储任务状态
}

export default function CaseDetailDashboard() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (!['marketing_manager', 'admin'].includes(user.userType)) {
        navigate('/login');
        return;
      }
      fetchCases();
    }
  }, [user]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await clientCaseApi.getCases({
        dateStart: dateStart ? new Date(dateStart).getTime() / 1000 : undefined,
        dateEnd: dateEnd ? new Date(dateEnd).getTime() / 1000 : undefined
      });
      setCases(response.data.records || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching cases');
      console.error('Error fetching cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = () => {
    fetchCases();
  };

  const getTaskName = (taskKey: string) => {
    const taskNames: { [key: string]: string } = {
      endeavor_submission: 'Endeavor Submission',
      national_importance: 'National Importance',
      future_plan: 'Future Plan',
      substantial_merits: 'Substantial Merits',
      recommendation_letters: 'Recommendation Letters',
      well_positioned: 'Well Positioned',
      balancing_factors: 'Balancing Factors'
    };
    return taskNames[taskKey] || taskKey;
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const handleCaseClick = (clientCaseId: number) => {
    console.log('Clicking case with ID:', clientCaseId);
    if (clientCaseId && !isNaN(clientCaseId)) {
      navigate(`/case-details/${clientCaseId}`);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f3f2ee', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ maxWidth: 1600, mx: 'auto', bgcolor: '#fff', borderRadius: 2, boxShadow: 1, p: 3, mt: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          Case Detail Dashboard
        </Typography>

        {/* 筛选区 */}
        <Grid container spacing={2} mb={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField 
                fullWidth 
                label="Date start" 
                placeholder="mm/dd/yyyy" 
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
              />
              <TextField 
                fullWidth 
                label="Date end" 
                placeholder="mm/dd/yyyy" 
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
              />
              <Button 
                variant="contained" 
                onClick={handleApplyFilter}
                sx={{ 
                  bgcolor: '#000',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: '#333'
                  },
                  minWidth: '100px'
                }}
              >
                Apply
              </Button>
            </Box>
          </Grid>
        </Grid>

        <TableContainer component={Paper} variant="outlined" sx={{ width: '100%', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Created At</TableCell>
                <TableCell align="center">User Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Details</TableCell>
                <TableCell align="center">Endeavor Submission</TableCell>
                <TableCell align="center">National Importance</TableCell>
                <TableCell align="center">Future Plan</TableCell>
                <TableCell align="center">Substantial Merits</TableCell>
                <TableCell align="center">Recommendation Letters</TableCell>
                <TableCell align="center">Well Positioned</TableCell>
                <TableCell align="center">Balancing Factors</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">Loading...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ color: 'error.main' }}>{error}</TableCell>
                </TableRow>
              ) : cases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">No data</TableCell>
                </TableRow>
              ) : (
                cases.map((caseItem) => (
                  <TableRow key={caseItem.id}>
                    <TableCell align="center">{formatDate(caseItem.createTimestamp)}</TableCell>
                    <TableCell align="center">{caseItem.userName}</TableCell>
                    <TableCell align="center">{caseItem.userEmail}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          handleCaseClick(caseItem.id);
                        }}
                        sx={{
                          borderColor: '#000',
                          color: '#000',
                          '&:hover': {
                            borderColor: '#333',
                            bgcolor: 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                      >
                        View details
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={caseItem.endeavor_submission ? 'Completed' : 'Pending'} 
                        color={caseItem.endeavor_submission ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={caseItem.national_importance ? 'Completed' : 'Pending'} 
                        color={caseItem.national_importance ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={caseItem.future_plan ? 'Completed' : 'Pending'} 
                        color={caseItem.future_plan ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={caseItem.substantial_merits ? 'Completed' : 'Pending'} 
                        color={caseItem.substantial_merits ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={caseItem.recommendation_letters ? 'Completed' : 'Pending'} 
                        color={caseItem.recommendation_letters ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={caseItem.well_positioned ? 'Completed' : 'Pending'} 
                        color={caseItem.well_positioned ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={caseItem.balancing_factors ? 'Completed' : 'Pending'} 
                        color={caseItem.balancing_factors ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
} 