import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, List, ListItem, ListItemText, Button, Collapse } from '@mui/material';
import InfoCollBasicInfo from './infoColl/InfoCollBasicInfo';
import { clientCaseApi } from '../services/api'; // 你需要实现这个API
import InfoCollSpouseInfo from './infoColl/InfoCollSpouseInfo';
import InfoCollChildrenInfo from './infoColl/InfoCollChildrenInfo';
import InfoCollResume from './infoColl/InfoCollResume';
import InfoCollAcademicHistory from './infoColl/InfoCollAcademicHistory';
import InfoCollEmploymentHistory from './infoColl/InfoCollEmploymentHistory';
import TaskEndeavorSubmission from './tasks/TaskEndeavorSubmission';
import { getUserType } from '../utils/user';
import TaskNationalImportance from './tasks/TaskNationalImportance';
import InfoCollNiwPetition from './infoColl/InfoCollNiwPetition';
import InfoCollRecommender from './infoColl/InfoCollRecommender';
import InfoCollFinalQuestionnaire from './infoColl/InfoCollFinalQuestionnaire';
import TaskFuturePlan from './tasks/TaskFuturePlan';
import TaskSubstantialMerits from './tasks/TaskSubstantialMerits';
import TaskRecommendationLetters from './tasks/TaskRecommendationLetters';
import TaskWellPositioned from './tasks/TaskWellPositioned';
import TaskBalancingFactors from './tasks/TaskBalancingFactors';
import { useParams } from 'react-router-dom';
import PLFormatting from './tasks/PLFormatting';

const CaseDetails: React.FC = () => {
  const [selected, setSelected] = useState({ section: 0, child: 0 });
  const formRef = useRef<any>(null);
  const [clientCase, setClientCase] = useState<any | null>(null);
  const userType = getUserType();
  const { userId, clientCaseId } = useParams<{ userId?: string; clientCaseId?: string }>();

  // 根据用户类型定义sections
  const sections = userType === 'client' ? [
    {
      title: 'Information Collection',
      collapsable: true,
      children: [
        { label: 'Basic Info', form: InfoCollBasicInfo },
        { label: 'Spouse Info', form: InfoCollSpouseInfo },
        { label: 'Children Info', form: InfoCollChildrenInfo },
        { label: 'Resume', form: InfoCollResume },
        { label: 'Academic History', form: InfoCollAcademicHistory },
        { label: 'Employment History', form: InfoCollEmploymentHistory },
        { label: 'Material for NIW Petition', form: InfoCollNiwPetition },
        { label: 'Recommender Info', form: InfoCollRecommender },
        { label: 'Final Questionnaire', form: InfoCollFinalQuestionnaire }
      ]
    },
    {
      title: 'Format',
      collapsable: true,
      children: [
        { label: 'Distinct Exhibit List', form: () => <div>Distinct Exhibit List</div> },
        { label: 'PL Formatting', form: PLFormatting },
        { label: 'Immigration Forms', form: () => <div>Immigration Forms</div> },
        { label: 'Combine All Documents', form: () => <div>Combine All Documents</div> }
      ]
    }
  ] : [
    {
      title: 'Information Collection',
      collapsable: true,
      children: [
        { label: 'Basic Info', form: InfoCollBasicInfo },
        { label: 'Spouse Info', form: InfoCollSpouseInfo },
        { label: 'Children Info', form: InfoCollChildrenInfo },
        { label: 'Resume', form: InfoCollResume },
        { label: 'Academic History', form: InfoCollAcademicHistory },
        { label: 'Employment History', form: InfoCollEmploymentHistory },
        { label: 'Material for NIW Petition', form: InfoCollNiwPetition },
        { label: 'Recommender Info', form: InfoCollRecommender },
        { label: 'Final Questionnaire', form: InfoCollFinalQuestionnaire }
      ]
    },
    {
      title: 'Tasks',
      collapsable: true,
      children: [
        { label: 'Task 1: Endeavor Submission', form: TaskEndeavorSubmission },
        { label: 'Task 2: National Importance', form: TaskNationalImportance },
        { label: 'Task 3: Petitioner\'s Future Plan', form: TaskFuturePlan },
        { label: 'Task 4: Prong 2 - Substantial Merits', form: TaskSubstantialMerits },
        { label: 'Task 5: Recommendation Letters', form: TaskRecommendationLetters },
        { label: 'Task 6: Prong 2 - Well Positioned', form: TaskWellPositioned },
        { label: 'Task 7: Prong 3 - Balancing Factors', form: TaskBalancingFactors },
      ]
    },
    {
      title: 'Format',
      collapsable: true,
      children: [
        { label: 'Distinct Exhibit List', form: () => <div>Distinct Exhibit List</div> },
        { label: 'PL Formatting', form: PLFormatting },
        { label: 'Immigration Forms', form: () => <div>Immigration Forms</div> },
        { label: 'Combine All Documents', form: () => <div>Combine All Documents</div> }
      ]
    }
  ];

  const [openSections, setOpenSections] = useState(() => sections.map(() => true));

  // 添加任务映射关系
  const taskMapping: { [key: string]: string } = {
    'substantial_merits': 'Task 4: Prong 2 - Substantial Merits',
    'endeavor_submission': 'Task 1: Endeavor Submission',
    'balancing_factors': 'Task 7: Prong 3 - Balancing Factors',
    'recommendation_letters': 'Task 5: Recommendation Letters',
    'national_importance': 'Task 2: National Importance',
    'future_plan': 'Task 3: Petitioner\'s Future Plan',
    'well_positioned': 'Task 6: Prong 2 - Well Positioned'
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
        let response;
        console.log('clientCaseId:', clientCaseId); // 添加日志
        if (clientCaseId && !isNaN(parseInt(clientCaseId))) {
          // 如果URL中有clientCaseId，则获取指定案例
          const id = parseInt(clientCaseId);
          console.log('Parsed clientCaseId:', id); // 添加日志
          response = await clientCaseApi.getCaseById(id);
        } else if (userId && !isNaN(parseInt(userId))) {
          // 如果URL中有userId，则获取指定用户的case
          response = await clientCaseApi.getCaseByUserId(parseInt(userId));
        } else {
          // 否则获取当前用户的case
          response = await clientCaseApi.getCurrentCase();
        }
        setClientCase(response.data);
      } catch (e) {
        console.error('Error fetching case:', e); // 添加错误日志
        setClientCase(null);
      }
    };
    fetchCase();
  }, [userId, clientCaseId]);

  const handleSectionClick = (idx: number) => {
    setOpenSections(prev => prev.map((open, i) => i === idx ? !open : open));
  };

  const handleSave = async () => {
    if (formRef.current && typeof formRef.current.submit === 'function') {
      await formRef.current.submit(clientCase);
    }
  };

  // 动态获取当前表单组件
  const CurrentForm = sections[selected.section].children[selected.child].form;

  // 判断是否显示保存按钮
  const shouldShowSaveButton = () => {
    return selected.section === 0 && getUserType() === 'client';
  };

  return (
    <Box sx={{ bgcolor: '#fafbfc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ pt: 6, pb: 6, flex: 1 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 4 }}>
          NW Process
        </Typography>
        <Grid container spacing={4}>
          {/* 左侧步骤导航 */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper sx={{ bgcolor: '#fff', borderRadius: 2, p: 0, boxShadow: 0, border: '1px solid #e0e6ef' }}>
              <List disablePadding>
                {sections.map((section, sIdx) => (
                  <Box key={section.title}>
                    <ListItem
                      sx={{ pl: 4, py: 1, bgcolor: '#f6f8fa', fontWeight: 700, cursor: 'pointer', borderLeft: '3px solid #1976d2', display: 'flex', alignItems: 'center' }}
                      onClick={() => handleSectionClick(sIdx)}
                    >
                      <Box sx={{ mr: 1, fontSize: 12, color: '#888', display: 'flex', alignItems: 'center' }}>
                        {openSections[sIdx] ? '▼' : '▶'}
                      </Box>
                      <ListItemText primary={<Typography fontWeight={700} fontSize={15}>{section.title}</Typography>} />
                    </ListItem>
                    <Collapse in={openSections[sIdx]} timeout="auto" unmountOnExit>
                      {section.children.map((child, cIdx) => {
                        const isEnabled = section.title === 'Information Collection' || section.title === 'Format' || isTaskEnabled(child.label);
                        return (
                          <ListItem
                            key={child.label}
                            sx={{
                              pl: 6,
                              py: 1,
                              cursor: isEnabled ? 'pointer' : 'not-allowed',
                              bgcolor: selected.section === sIdx && selected.child === cIdx ? '#159895' : undefined,
                              borderLeft: selected.section === sIdx && selected.child === cIdx ? '3px solid #1976d2' : '3px solid transparent',
                              opacity: isEnabled ? 1 : 0.5,
                            }}
                            onClick={() => isEnabled && setSelected({ section: sIdx, child: cIdx })}
                          >
                            <ListItemText
                              primary={
                                <Typography
                                  fontWeight={selected.section === sIdx && selected.child === cIdx ? 600 : 400}
                                  fontSize={15}
                                  sx={{ color: selected.section === sIdx && selected.child === cIdx ? '#fff' : undefined }}
                                >
                                  {child.label}
                                </Typography>
                              }
                            />
                          </ListItem>
                        );
                      })}
                    </Collapse>
                  </Box>
                ))}
              </List>
            </Paper>
          </Grid>
          {/* 右侧表单区 */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 4, border: '1px solid #e0e6ef', minHeight: 500, position: 'relative', pb: 12 }}>
              {/* 动态渲染表单并传递ref */}
              {CurrentForm && React.createElement(CurrentForm, { ref: formRef, clientCaseId: clientCase?.clientCaseId })}
              {shouldShowSaveButton() && (
                <Box sx={{ position: 'absolute', right: 32, bottom: 64 }}>
                  <Button variant="contained" color="primary" sx={{ px: 5, py: 1.2, fontWeight: 700 }} onClick={handleSave}>
                    Save
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CaseDetails; 