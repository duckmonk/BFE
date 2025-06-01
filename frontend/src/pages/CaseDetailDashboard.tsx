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
    if (!user || user.userType !== 'marketing_manager') {
      navigate('/login');
      return;
    }
    fetchCases();
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
      setError('获取案例数据失败');
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
      navigate(`/case-details/id/${clientCaseId}`);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', bgcolor: '#fff', borderRadius: 2, boxShadow: 1, p: 3, mt: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Case Detail Dashboard
      </Typography>

      {/* 筛选区 */}
      <Grid container spacing={2} mb={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
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
                }
              }}
            >
              Apply
            </Button>
          </Box>
        </Grid>
      </Grid>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>创建时间</TableCell>
              <TableCell>用户名</TableCell>
              <TableCell>邮箱</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Endeavor Submission</TableCell>
              <TableCell>National Importance</TableCell>
              <TableCell>Future Plan</TableCell>
              <TableCell>Substantial Merits</TableCell>
              <TableCell>Recommendation Letters</TableCell>
              <TableCell>Well Positioned</TableCell>
              <TableCell>Balancing Factors</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={11} align="center">加载中...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ color: 'error.main' }}>{error}</TableCell>
              </TableRow>
            ) : cases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center">暂无数据</TableCell>
              </TableRow>
            ) : (
              cases.map((caseItem) => (
                <TableRow key={caseItem.id}>
                  <TableCell>{formatDate(caseItem.createTimestamp)}</TableCell>
                  <TableCell>{caseItem.userName}</TableCell>
                  <TableCell>{caseItem.userEmail}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        console.log('Button clicked for case:', caseItem);
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
                  <TableCell>
                    <Chip 
                      label={caseItem.endeavor_submission ? '已完成' : '未完成'} 
                      color={caseItem.endeavor_submission ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={caseItem.national_importance ? '已完成' : '未完成'} 
                      color={caseItem.national_importance ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={caseItem.future_plan ? '已完成' : '未完成'} 
                      color={caseItem.future_plan ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={caseItem.substantial_merits ? '已完成' : '未完成'} 
                      color={caseItem.substantial_merits ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={caseItem.recommendation_letters ? '已完成' : '未完成'} 
                      color={caseItem.recommendation_letters ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={caseItem.well_positioned ? '已完成' : '未完成'} 
                      color={caseItem.well_positioned ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={caseItem.balancing_factors ? '已完成' : '未完成'} 
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
  );
} 