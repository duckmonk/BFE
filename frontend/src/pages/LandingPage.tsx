import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, Button, Stack, Dialog, DialogContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TaskEndeavorSubmission from './tasks/TaskEndeavorSubmission';
import TaskNationalImportance from './tasks/TaskNationalImportance';
import TaskFuturePlan from './tasks/TaskFuturePlan';
import TaskSubstantialMerits from './tasks/TaskSubstantialMerits';
import TaskRecommendationLetters from './tasks/TaskRecommendationLetters';
import TaskWellPositioned from './tasks/TaskWellPositioned';
import TaskBalancingFactors from './tasks/TaskBalancingFactors';
import { clientCaseApi } from '../services/api';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [openTask1Dialog, setOpenTask1Dialog] = useState(false);
  const [openTask2Dialog, setOpenTask2Dialog] = useState(false);
  const [openTask3Dialog, setOpenTask3Dialog] = useState(false);
  const [openTask4Dialog, setOpenTask4Dialog] = useState(false);
  const [openTask5Dialog, setOpenTask5Dialog] = useState(false);
  const [openTask6Dialog, setOpenTask6Dialog] = useState(false);
  const [openTask7Dialog, setOpenTask7Dialog] = useState(false);
  const [clientCase, setClientCase] = useState<any | null>(null);

  // 添加任务映射关系
  const taskMapping: { [key: string]: string } = {
    'substantial_merits': 'Task 4: Substantial Merit',
    'endeavor_submission': 'Task 1: Endeavor',
    'balancing_factors': 'Task 7: Prong 3',
    'recommendation_letters': 'Task 5: Recommendation Letters',
    'national_importance': 'Task 2: National Importance',
    'future_plan': 'Task 3: Future Plan',
    'well_positioned': 'Task 6: Well Positioned'
  };

  // 检查任务是否启用
  const isTaskEnabled = (taskLabel: string) => {
    if (!clientCase?.enabledTasks) return false;
    const taskKey = Object.entries(taskMapping).find(([_, label]) => label === taskLabel)?.[0];
    return taskKey ? clientCase.enabledTasks.includes(taskKey) : false;
  };

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await clientCaseApi.getCurrentCase();
        setClientCase(res.data);
      } catch (e) {
        setClientCase(null);
      }
    };
    fetchCase();
  }, []);

  const handleTask1Click = () => {
    if (isTaskEnabled('Task 1: Endeavor')) {
    setOpenTask1Dialog(true);
    }
  };

  const handleTask2Click = () => {
    if (isTaskEnabled('Task 2: National Importance')) {
    setOpenTask2Dialog(true);
    }
  };

  const handleTask3Click = () => {
    if (isTaskEnabled('Task 3: Future Plan')) {
      setOpenTask3Dialog(true);
    }
  };

  const handleTask4Click = () => {
    if (isTaskEnabled('Task 4: Substantial Merit')) {
      setOpenTask4Dialog(true);
    }
  };

  const handleTask5Click = () => {
    if (isTaskEnabled('Task 5: Recommendation Letters')) {
      setOpenTask5Dialog(true);
    }
  };

  const handleTask6Click = () => {
    if (isTaskEnabled('Task 6: Well Positioned')) {
      setOpenTask6Dialog(true);
    }
  };

  const handleTask7Click = () => {
    if (isTaskEnabled('Task 7: Prong 3')) {
      setOpenTask7Dialog(true);
    }
  };

  const handleCloseTask1Dialog = () => {
    setOpenTask1Dialog(false);
  };

  const handleCloseTask2Dialog = () => {
    setOpenTask2Dialog(false);
  };

  const handleCloseTask3Dialog = () => {
    setOpenTask3Dialog(false);
  };

  const handleCloseTask4Dialog = () => {
    setOpenTask4Dialog(false);
  };

  const handleCloseTask5Dialog = () => {
    setOpenTask5Dialog(false);
  };

  const handleCloseTask6Dialog = () => {
    setOpenTask6Dialog(false);
  };

  const handleCloseTask7Dialog = () => {
    setOpenTask7Dialog(false);
  };

  return (
    <Box sx={{ bgcolor: '#fafbfc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ pt: 6, pb: 6, flex: 1 }}>
        <Box sx={{ display: 'flex', gap: 4 }}>
          {/* 左侧 */}
          <Box sx={{ flex: 7, minWidth: 0 }}>
            <Paper sx={{ p: 2, borderRadius: 3, mb: 2, height: '100%'}}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#F9FAFC',
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                position: 'relative',
                top: -16,
                left: -16,
                right: -16,
                width: 'calc(100% + 32px)',
                boxSizing: 'border-box',
              }}>
                <Typography variant="h6" fontWeight={700} sx={{ pl: 3, pt: 2, pb: 2 }}>
                  Case Processing
                </Typography>
              </Box>
              {/* 嵌套大卡片 */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 2, border: '2px solid #e0e6ef', mb: 2 }}>
                  <Grid container spacing={2} alignItems="stretch">
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box 
                        sx={{ 
                          bgcolor: '#F9FAFC', 
                          border: '2px solid #cfd8dc', 
                          borderRadius: 2, 
                          p: 2, 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          justifyContent: 'center',
                          cursor: isTaskEnabled('Task 1: Endeavor') ? 'pointer' : 'not-allowed',
                          opacity: isTaskEnabled('Task 1: Endeavor') ? 1 : 0.5,
                          '&:hover': {
                            bgcolor: isTaskEnabled('Task 1: Endeavor') ? '#f0f4f8' : undefined,
                          }
                        }}
                        onClick={handleTask1Click}
                      >
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>(Our To-Do)</Typography>
                        <Typography variant="subtitle1" fontWeight={700}>
                          Task 1: Endeavor
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box 
                        sx={{ 
                          bgcolor: '#F9FAFC', 
                          border: '2px solid #cfd8dc', 
                          borderRadius: 2, 
                          p: 2, 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          justifyContent: 'center',
                          cursor: isTaskEnabled('Task 2: National Importance') ? 'pointer' : 'not-allowed',
                          opacity: isTaskEnabled('Task 2: National Importance') ? 1 : 0.5,
                          '&:hover': {
                            bgcolor: isTaskEnabled('Task 2: National Importance') ? '#f0f4f8' : undefined,
                          }
                        }}
                        onClick={handleTask2Click}
                      >
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>(Our To-Do)</Typography>
                        <Typography variant="subtitle1" fontWeight={700}>
                          Task 2: National Importance
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ bgcolor: '#f3f6fa', borderRadius: 1, p: 1, textAlign: 'center', color: '#888', fontWeight: 500, fontSize: 15, mt: 2 }}>
                        After Tasks 1 & 2, complete Future Plan
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box 
                      sx={{ 
                        bgcolor: '#F9FAFC', 
                        border: '2px solid #cfd8dc', 
                        borderRadius: 2, 
                        p: 2, 
                        mb: 1, 
                        height: '50%',
                        opacity: isTaskEnabled('Task 3: Future Plan') ? 1 : 0.5,
                        cursor: isTaskEnabled('Task 3: Future Plan') ? 'pointer' : 'not-allowed'
                      }}
                      onClick={handleTask3Click}
                    >
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>(Your To-Do)</Typography>
                      <Typography variant="subtitle1" fontWeight={700}>Task 3: Future Plan</Typography>
                      <Typography variant="caption" color="text.secondary">"After Task 2 completion"</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box 
                      sx={{ 
                        bgcolor: '#F9FAFC', 
                        border: '2px solid #cfd8dc', 
                        borderRadius: 2, 
                        p: 2, 
                        mb: 1, 
                        height: '50%',
                        opacity: isTaskEnabled('Task 4: Substantial Merit') ? 1 : 0.5,
                        cursor: isTaskEnabled('Task 4: Substantial Merit') ? 'pointer' : 'not-allowed'
                      }}
                      onClick={handleTask4Click}
                    >
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>(Our To-Do)</Typography>
                      <Typography variant="subtitle1" fontWeight={700}>Task 4: Substantial Merit</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box 
                      sx={{ 
                        bgcolor: '#F9FAFC', 
                        border: '2px solid #cfd8dc', 
                        borderRadius: 2, 
                        p: 2, 
                        mb: 1, 
                        height: '100%',
                        opacity: isTaskEnabled('Task 5: Recommendation Letters') ? 1 : 0.5,
                        cursor: isTaskEnabled('Task 5: Recommendation Letters') ? 'pointer' : 'not-allowed'
                      }}
                      onClick={handleTask5Click}
                    >
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>(Shared To-Do)</Typography>
                      <Typography variant="subtitle1" fontWeight={700}>Task 5: Recommendation Letters</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: 13 }}>
                        - Task 5.1: RL 1<br />
                        - Task 5.2: RL 2<br />
                        - Task 5.3: RL 3<br />
                        - Task 5.4: RL 4
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box 
                      sx={{ 
                        bgcolor: '#F9FAFC', 
                        border: '2px solid #cfd8dc', 
                        borderRadius: 2, 
                        p: 2, 
                        mb: 1, 
                        height: '100%',
                        opacity: isTaskEnabled('Task 6: Well Positioned') ? 1 : 0.5,
                        cursor: isTaskEnabled('Task 6: Well Positioned') ? 'pointer' : 'not-allowed'
                      }}
                      onClick={handleTask6Click}
                    >
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>(Our To-Do)</Typography>
                      <Typography variant="subtitle1" fontWeight={700}>Task 6: Well Positioned</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box 
                      sx={{ 
                        bgcolor: '#F9FAFC', 
                        border: '2px solid #cfd8dc', 
                        borderRadius: 2, 
                        p: 2, 
                        mb: 1, 
                        height: '100%',
                        opacity: isTaskEnabled('Task 7: Prong 3') ? 1 : 0.5,
                        cursor: isTaskEnabled('Task 7: Prong 3') ? 'pointer' : 'not-allowed'
                      }}
                      onClick={handleTask7Click}
                    >
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>(Our To-Do)</Typography>
                      <Typography variant="subtitle1" fontWeight={700}>Task 7: Prong 3</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ 
                      bgcolor: '#F9FAFC', 
                      border: '2px solid #cfd8dc', 
                      borderRadius: 2, 
                      p: 2, 
                      height: '100%',
                      opacity: isTaskEnabled('Task 8: Final Forms') ? 1 : 0.5,
                      cursor: isTaskEnabled('Task 8: Final Forms') ? 'pointer' : 'not-allowed'
                    }}>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>(Shared To-Do)</Typography>
                      <Typography variant="subtitle1" fontWeight={700}>Task 8: Final Forms</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                        Forms & Documentation
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>
          {/* 右侧 */}
          <Box sx={{ flex: 5, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%', flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  bgcolor: '#F9FAFC',
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  position: 'relative',
                  top: -24,
                  left: -24,
                  right: -24,
                  width: 'calc(100% + 48px)',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/guidelines')}
              >
                <Typography variant="h6" fontWeight={700} sx={{ pl: 3, pt: 2, pb: 2 }}>
                  Application Guidelines
                </Typography>
                <Box sx={{ mr: 3, color: '#bdbdbd', fontSize: 20, display: 'flex', alignItems: 'center' }}>
                  ▶
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, ml: 0 }}>
                Click to view detailed guidelines on how to prepare your NIW application.
              </Typography>
              <Stack spacing={2}>
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Form Filling Instructions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Guidance on completing each required USCIS form correctly.
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Supporting Documents
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Requirements for evidence and supplementary materials.
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Submission Process
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Step-by-step instructions for final submission and tracking.
                  </Typography>
                </Paper>
              </Stack>
            </Paper>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            sx={{ bgcolor: '#000', color: '#fff', borderRadius: 2, fontWeight: 700, px: 6, py: 1.5 }}
            onClick={() => navigate('/case-details')}
          >
            Begin NIW Application Process
          </Button>
        </Box>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            For assistance, contact: support@breakfreeearth.com
          </Typography>
        </Box>
      </Container>

      {/* Task 1 Dialog */}
      <Dialog 
        open={openTask1Dialog} 
        onClose={handleCloseTask1Dialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          <TaskEndeavorSubmission clientCaseId={clientCase?.clientCaseId} />
        </DialogContent>
      </Dialog>

      {/* Task 2 Dialog */}
      <Dialog 
        open={openTask2Dialog} 
        onClose={handleCloseTask2Dialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          <TaskNationalImportance clientCaseId={clientCase?.clientCaseId} />
        </DialogContent>
      </Dialog>

      {/* Task 3 Dialog */}
      <Dialog 
        open={openTask3Dialog} 
        onClose={handleCloseTask3Dialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          <TaskFuturePlan clientCaseId={clientCase?.clientCaseId} />
        </DialogContent>
      </Dialog>

      {/* Task 4 Dialog */}
      <Dialog 
        open={openTask4Dialog} 
        onClose={handleCloseTask4Dialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          <TaskSubstantialMerits clientCaseId={clientCase?.clientCaseId} />
        </DialogContent>
      </Dialog>

      {/* Task 5 Dialog */}
      <Dialog 
        open={openTask5Dialog} 
        onClose={handleCloseTask5Dialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          <TaskRecommendationLetters clientCaseId={clientCase?.clientCaseId} />
        </DialogContent>
      </Dialog>

      {/* Task 6 Dialog */}
      <Dialog 
        open={openTask6Dialog} 
        onClose={handleCloseTask6Dialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          <TaskWellPositioned clientCaseId={clientCase?.clientCaseId} />
        </DialogContent>
      </Dialog>

      {/* Task 7 Dialog */}
      <Dialog 
        open={openTask7Dialog} 
        onClose={handleCloseTask7Dialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          <TaskBalancingFactors clientCaseId={clientCase?.clientCaseId} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LandingPage; 