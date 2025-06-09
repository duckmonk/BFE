import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Box, Container, Typography, Grid, Paper, List, ListItem, ListItemText, Button, Collapse } from '@mui/material';
import InfoCollBasicInfo from './infoColl/InfoCollBasicInfo';
import { clientCaseApi } from '../services/api';
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
import TaskFuturePlan from './tasks/TaskFuturePlan';
import TaskSubstantialMerits from './tasks/TaskSubstantialMerits';
import TaskRecommendationLetters from './tasks/TaskRecommendationLetters';
import TaskWellPositioned from './tasks/TaskWellPositioned';
import TaskBalancingFactors from './tasks/TaskBalancingFactors';
import TaskFinalQuestionnaire from './tasks/TaskFinalQuestionnaire';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import PLFormatting from './tasks/PLFormatting';
import { getEnabledTasks } from '../utils/taskUtils';
import ImmigrationForms from './tasks/ImmigrationForms';
import CombineDocuments from './tasks/CombineDocuments';

interface SectionChild {
  label: string;
  form: React.ForwardRefExoticComponent<any>;
  finished?: boolean;
}

interface Section {
  title: string;
  collapsable: boolean;
  children: SectionChild[];
}

const CaseDetails: React.FC = () => {
  const [selected, setSelected] = useState({ section: 0, child: 0 });
  const formRef = useRef<any>(null);
  const [clientCase, setClientCase] = useState<any | null>(null);
  const [tasksStatus, setTasksStatus] = useState<{ [key: string]: boolean }>({});
  const userType = getUserType();
  const { clientCaseId } = useParams<{ clientCaseId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentSection, setCurrentSection] = useState<string>('');
  const [currentChild, setCurrentChild] = useState<string>('');
  const [showJumpToLanding, setShowJumpToLanding] = useState(false);
  const navigate = useNavigate();

  // 根据用户类型定义sections
  const sections = useMemo(() => (
    userType === 'client'
      ? [
        {
          title: 'Information Collection',
          collapsable: true,
          children: [
            { label: 'Basic Info', form: InfoCollBasicInfo, finished: clientCase?.basicInfoFinished },
            { label: 'Spouse Info', form: InfoCollSpouseInfo, finished: clientCase?.spouseInfoFinished },
            { label: 'Children Info', form: InfoCollChildrenInfo, finished: clientCase?.childrenInfoFinished },
            { label: 'Resume', form: InfoCollResume, finished: clientCase?.resumeFinished },
            { label: 'Academic History', form: InfoCollAcademicHistory, finished: clientCase?.academicHistoryFinished },
            { label: 'Employment History', form: InfoCollEmploymentHistory, finished: clientCase?.employmentHistoryFinished },
            { label: 'Material for NIW Petition', form: InfoCollNiwPetition, finished: clientCase?.niwPetitionFinished },
            { label: 'Recommender Info', form: InfoCollRecommender, finished: clientCase?.recommenderFinished }
          ]
        }
      ]
      : [
        {
          title: 'Information Collection',
          collapsable: true,
          children: [
            { label: 'Basic Info', form: InfoCollBasicInfo, finished: clientCase?.basicInfoFinished },
            { label: 'Spouse Info', form: InfoCollSpouseInfo, finished: clientCase?.spouseInfoFinished },
            { label: 'Children Info', form: InfoCollChildrenInfo, finished: clientCase?.childrenInfoFinished },
            { label: 'Resume', form: InfoCollResume, finished: clientCase?.resumeFinished },
            { label: 'Academic History', form: InfoCollAcademicHistory, finished: clientCase?.academicHistoryFinished },
            { label: 'Employment History', form: InfoCollEmploymentHistory, finished: clientCase?.employmentHistoryFinished },
            { label: 'Material for NIW Petition', form: InfoCollNiwPetition, finished: clientCase?.niwPetitionFinished },
            { label: 'Recommender Info', form: InfoCollRecommender, finished: clientCase?.recommenderFinished }
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
            { label: 'Task 8: Final Questionnaire', form: TaskFinalQuestionnaire }
          ]
        },
        {
          title: 'Format',
          collapsable: true,
          children: [
            { label: 'PL Formatting', form: PLFormatting },
            { label: 'Immigration Forms', form: ImmigrationForms },
            { label: 'Combine All Documents', form: CombineDocuments }
          ]
        }
      ]
  ), [userType, clientCase]);

  const [openSections, setOpenSections] = useState(() => sections.map(() => true));

  // 添加任务映射关系
  const taskMapping: { [key: string]: string } = {
    'substantial_merits': 'Task 4: Prong 2 - Substantial Merits',
    'endeavor_submission': 'Task 1: Endeavor Submission',
    'balancing_factors': 'Task 7: Prong 3 - Balancing Factors',
    'recommendation_letters': 'Task 5: Recommendation Letters',
    'national_importance': 'Task 2: National Importance',
    'future_plan': 'Task 3: Petitioner\'s Future Plan',
    'well_positioned': 'Task 6: Prong 2 - Well Positioned',
    'final_questionnaire': 'Task 8: Final Questionnaire'
  };

  const enabledTasks = useMemo(() => getEnabledTasks(tasksStatus), [tasksStatus]);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        let response;
        console.log('clientCaseId:', clientCaseId);
        if (clientCaseId && !isNaN(parseInt(clientCaseId))) {
          const id = parseInt(clientCaseId);
          console.log('Parsed clientCaseId:', id);
          response = await clientCaseApi.getCaseById(id);
        } else if (userType && !isNaN(parseInt(userType))) {
          response = await clientCaseApi.getCaseByUserId(parseInt(userType));
        } else {
          response = await clientCaseApi.getCurrentCase();
        }
        setClientCase(response.data);
        // 拉取任务状态
        if (response.data?.clientCaseId) {
          const tasksResponse = await clientCaseApi.getTasksStatus(response.data.clientCaseId);
          setTasksStatus(tasksResponse.data);
        }
      } catch (e) {
        console.error('Error fetching case:', e);
        setClientCase(null);
      }
    };
    fetchCase();
  }, [userType, clientCaseId]);

  // 从 URL 参数中读取当前 tab 信息，并在页面加载时恢复该 tab
  useEffect(() => {
    const sectionParam = searchParams.get('section');
    const childParam = searchParams.get('child');
    if (sectionParam !== null && childParam !== null) {
      const section = parseInt(sectionParam);
      const child = parseInt(childParam);
      if (!isNaN(section) && !isNaN(child) && section >= 0 && section < sections.length && child >= 0 && child < sections[section].children.length) {
        setSelected({ section, child });
      }
    }
  }, [searchParams, sections]);

  const handleSectionClick = (idx: number) => {
    setOpenSections(prev => prev.map((open, i) => i === idx ? !open : open));
  };

  const handleSave = async () => {
    if (formRef.current && typeof formRef.current.submit === 'function') {
      await formRef.current.submit(clientCase);
      // 保存后刷新 case 信息和任务状态
      if (clientCase?.clientCaseId) {
        const caseResponse = await clientCaseApi.getCaseById(clientCase.clientCaseId);
        setClientCase(caseResponse.data);
        const tasksResponse = await clientCaseApi.getTasksStatus(clientCase.clientCaseId);
        setTasksStatus(tasksResponse.data);
      }
      // 调用 handleAfterSave
      handleAfterSave();
    }
  };

  // 动态获取当前表单组件
  const CurrentForm = sections[selected.section].children[selected.child].form;

  // 判断是否显示保存按钮
  const shouldShowSaveButton = () => {
    return selected.section === 0 && getUserType() === 'client';
  };

  // 检查任务是否启用
  const isTaskEnabled = (taskLabel: string): boolean => {
    // 兼容 label 为 'Task X\n名称' 的情况
    const normalizedLabel = taskLabel.replace('\n', ': ');
    const taskKey = Object.entries(taskMapping).find(([_, label]) => label === normalizedLabel)?.[0];
    // 使用本地计算的 enabledTasks 集合来判断
    return taskKey ? enabledTasks.has(taskKey) : false;
  };

  // 获取当前页面的索引
  const getCurrentPageIndex = () => {
    const section = sections[selected.section];
    if (!section) return -1;
    return selected.child;
  };

  // 检查是否是最后一个页面
  const isLastPage = () => {
    const currentIndex = getCurrentPageIndex();
    if (currentIndex === -1) return false;
    
    const section = sections[selected.section];
    if (!section) return false;
    
    return currentIndex === section.children.length - 1;
  };

  // 处理保存后的回调
  const handleAfterSave = () => {
    if (isLastPage()) {
      setShowJumpToLanding(true);
    }
  };

  // 跳转到 landing page
  const handleJumpToLanding = () => {
    navigate('/landing');
  };

  return (
    <Box sx={{ bgcolor: '#f3f2ee', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ pt: 6, pb: 6, flex: 1 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 4 }}>
          NIW Process
        </Typography>
        <Grid container spacing={4}>
          {/* 左侧步骤导航 */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ bgcolor: '#fff', borderRadius: 2, p: 0, boxShadow: 0, border: '1px solid #e0e6ef' }}>
              <List disablePadding>
                {sections.map((section, sIdx) => (
                  <Box key={section.title}>
                    <ListItem
                      sx={{ pl: 2, py: 1, bgcolor: '#f6f8fa', fontWeight: 700, cursor: 'pointer', borderLeft: '3px solid #1976d2', display: 'flex', alignItems: 'center' }}
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
                        const taskKey = Object.entries(taskMapping).find(([_, label]) => label === child.label)?.[0];
                        const taskFinished = taskKey ? tasksStatus[taskKey] : false;
                        const childWithFinished = child as SectionChild;
                        return (
                          <ListItem
                            key={child.label}
                            sx={{
                              pl: 3,
                              py: 1,
                              cursor: isEnabled ? 'pointer' : 'not-allowed',
                              bgcolor: selected.section === sIdx && selected.child === cIdx ? '#159895' : undefined,
                              borderLeft: selected.section === sIdx && selected.child === cIdx ? '3px solid #1976d2' : '3px solid transparent',
                              opacity: isEnabled ? 1 : 0.5,
                            }}
                            onClick={() => {
                              if (isEnabled) {
                                setSelected({ section: sIdx, child: cIdx });
                                // 更新 URL 参数以保存当前 tab 信息
                                setSearchParams({ section: sIdx.toString(), child: cIdx.toString() });
                                // 设置当前 section 和 child
                                setCurrentSection(section.title);
                                setCurrentChild(child.label);
                              }
                            }}
                          >
                            <ListItemText
                              primary={
                                child.label.includes(': ')
                                  ? (
                                    <>
                                      <Typography
                                        fontWeight={selected.section === sIdx && selected.child === cIdx ? 600 : 400}
                                        fontSize={15}
                                        sx={{ color: selected.section === sIdx && selected.child === cIdx ? '#fff' : undefined, lineHeight: 1.1 }}
                                      >
                                        {child.label.split(': ')[0]}
                                        {(taskFinished || childWithFinished.finished) && <span style={{ marginLeft: 6 }}>✅</span>}
                                      </Typography>
                                      <Typography
                                        fontWeight={selected.section === sIdx && selected.child === cIdx ? 600 : 400}
                                        fontSize={13}
                                        sx={{ color: selected.section === sIdx && selected.child === cIdx ? '#fff' : undefined, lineHeight: 1.1 }}
                                      >
                                        {child.label.split(': ')[1]}
                                      </Typography>
                                    </>
                                  )
                                  : (
                                    <Typography
                                      fontWeight={selected.section === sIdx && selected.child === cIdx ? 600 : 400}
                                      fontSize={15}
                                      sx={{ color: selected.section === sIdx && selected.child === cIdx ? '#fff' : undefined }}
                                    >
                                      {child.label}
                                      {(taskFinished || childWithFinished.finished) && <span style={{ marginLeft: '8px' }}>✅</span>}
                                    </Typography>
                                  )
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
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 4, border: '1px solid #e0e6ef', minHeight: 500, position: 'relative', pb: 2 }}>
              {/* 动态渲染表单并传递ref */}
              {CurrentForm && clientCase && (
                React.createElement(CurrentForm as any, { 
                  ref: formRef, 
                  clientCaseId: clientCase.clientCaseId,
                  userId: clientCase.userId,
                  userType: userType,
                  immigrationForms: clientCase.immigrationForms || null
                })
              )}
            </Box>
            <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              {shouldShowSaveButton() && (
                <Button variant="contained" color="primary" sx={{ px: 5, py: 1.2, fontWeight: 700 }} onClick={handleSave}>
                  Save
                </Button>
              )}
              {showJumpToLanding && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleJumpToLanding}
                  sx={{ px: 5, py: 1.2, fontWeight: 700 }}
                >
                  Return to Dashboard
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CaseDetails; 