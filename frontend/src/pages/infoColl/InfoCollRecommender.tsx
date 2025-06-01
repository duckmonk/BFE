import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Box, Typography, TextField, MenuItem, Snackbar, Alert, Accordion, AccordionSummary, AccordionDetails, IconButton, Button, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { infoCollApi } from '../../services/api';
import FileUploadButton from '../../components/FileUploadButton';

const refereeTypeOptions = ['Dependent', 'Independent'];
const pronounOptions = ['He/Him', 'She/Her'];
const relationshipOptions = ['Colleague', 'Supervisor', 'Client', 'Advisor', 'Other'];
const evalAspectsOptions = ['Research Impact', 'Industry Leadership', 'Innovation', 'Teaching', 'Other'];

interface Recommender {
  id?: number;
  name: string;
  resume: string;
  type: string;
  code: string;
  pronoun: string;
  note: string;
  linkedContributions: string[];
  relationship: string;
  relationshipOther: string;
  company: string;
  department: string;
  title: string;
  meetDate: Date | null;
  evalAspects: string[];
  evalAspectsOther: string;
  independentEval: string;
  characteristics: string;
  relationshipStory: string;
}

const InfoCollRecommender = forwardRef(({ clientCaseId }: { clientCaseId: number }, ref) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [recommenders, setRecommenders] = useState<Recommender[]>([]);
  const [contributions, setContributions] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      if (clientCaseId) {
        try {
          // 获取推荐人信息
          const recommenderRes = await infoCollApi.getRecommender(clientCaseId);
          if (recommenderRes && recommenderRes.data) {
            setFormData(recommenderRes.data);
            if (recommenderRes.data.recommenders) {
              setRecommenders(recommenderRes.data.recommenders);
            }
          }

          // 获取贡献列表
          const contributionsRes = await infoCollApi.getContributions(clientCaseId);
          if (contributionsRes && contributionsRes.data) {
            const academicContributions = contributionsRes.data.academicContributions?.map((c: any) => c.contributionTitle) || [];
            const industryContributions = contributionsRes.data.industryContributions?.map((c: any) => c.projectTitle) || [];
            setContributions([...academicContributions, ...industryContributions]);
          }
        } catch (error) {
          // 可以加错误提示
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [clientCaseId]);

  // 添加新的推荐人
  const handleAddRecommender = () => {
    setRecommenders(prev => [...prev, {
      name: '',
      resume: '',
      type: '',
      code: '',
      pronoun: '',
      note: '',
      linkedContributions: [],
      relationship: '',
      relationshipOther: '',
      company: '',
      department: '',
      title: '',
      meetDate: null,
      evalAspects: [],
      evalAspectsOther: '',
      independentEval: '',
      characteristics: '',
      relationshipStory: ''
    }]);
  };

  // 删除推荐人
  const handleDeleteRecommender = (index: number) => {
    setRecommenders(prev => prev.filter((_, i) => i !== index));
  };

  // 更新推荐人信息
  const handleRecommenderChange = (index: number, field: keyof Recommender, value: any) => {
    setRecommenders(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  // 关闭snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    getFormData: () => ({ ...formData, recommenders }),
    submit: async (clientCase: any) => {
      try {
        const data = { 
          id: formData.id,
          clientCaseId: clientCase.clientCaseId,
          recommenders: recommenders.map(recommender => ({
            ...recommender,
            clientCaseId: clientCase.clientCaseId
          }))
        };

        // 提交数据
        const response = await infoCollApi.submitRecommender(data);
        
        // 更新本地数据
        if (response.data) {
          setFormData(response.data);
          if (response.data.recommenders) {
            setRecommenders(response.data.recommenders);
          }
        }

        setSnackbar({ open: true, message: '保存成功', severity: 'success' });
      } catch (e: any) {
        setSnackbar({ open: true, message: e?.message || '保存失败', severity: 'error' });
      }
    }
  }));

  return (
    <Box component="form" noValidate autoComplete="off">
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Recommender Information</Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddRecommender}
          variant="outlined"
          size="small"
        >
          Add Recommender
        </Button>
      </Box>

      {recommenders.map((recommender, index) => (
        <Accordion key={index} sx={{ mb: 1 }} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
              <Typography>
                {recommender.name || `Recommender ${index + 1}`}
              </Typography>
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRecommender(index);
                }}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    borderRadius: '50%'
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ position: 'relative' }}>
              <TextField
                label="Referee Name"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={recommender.name}
                onChange={(e) => handleRecommenderChange(index, 'name', e.target.value)}
                required
              />

              <FileUploadButton
                label="Referee Resume"
                fileType="recommenderResume"
                onFileUrlChange={(url: string | null) => handleRecommenderChange(index, 'resume', url || '')}
                required
              />

              <TextField
                label="Referee Type"
                select
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={recommender.type}
                onChange={(e) => handleRecommenderChange(index, 'type', e.target.value)}
                required
              >
                {refereeTypeOptions.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </TextField>

              <TextField
                label="Referee Code"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={recommender.code}
                onChange={(e) => handleRecommenderChange(index, 'code', e.target.value)}
                required
              />

              <TextField
                label="Referee Pronoun"
                select
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={recommender.pronoun}
                onChange={(e) => handleRecommenderChange(index, 'pronoun', e.target.value)}
                required
              >
                {pronounOptions.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </TextField>

              <TextField
                label="Note"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={recommender.note}
                onChange={(e) => handleRecommenderChange(index, 'note', e.target.value)}
                multiline
                rows={2}
              />

              <TextField
                label="Select the petitioner's key contributions that this referee can evaluate"
                select
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={recommender.linkedContributions}
                onChange={(e) => handleRecommenderChange(index, 'linkedContributions', e.target.value)}
                required
                SelectProps={{
                  multiple: true
                }}
              >
                {contributions.map((contribution, idx) => (
                  <MenuItem key={idx} value={contribution}>
                    {contribution}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="What is your relationship with this referee?"
                select
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={recommender.relationship}
                onChange={(e) => handleRecommenderChange(index, 'relationship', e.target.value)}
                required
              >
                {relationshipOptions.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </TextField>

              {recommender.relationship === 'Other' && (
                <TextField
                  label="If 'Other,' specify"
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                  value={recommender.relationshipOther}
                  onChange={(e) => handleRecommenderChange(index, 'relationshipOther', e.target.value)}
                  required
                />
              )}

              <TextField
                label="Referee Current Company"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={recommender.company}
                onChange={(e) => handleRecommenderChange(index, 'company', e.target.value)}
                required
              />

              <TextField
                label="Referee Current Department"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={recommender.department}
                onChange={(e) => handleRecommenderChange(index, 'department', e.target.value)}
                required
              />

              <TextField
                label="Referee Current Title"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={recommender.title}
                onChange={(e) => handleRecommenderChange(index, 'title', e.target.value)}
                required
              />

              <TextField
                label="When did you first meet?"
                type="date"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
                value={recommender.meetDate || ''}
                onChange={(e) => handleRecommenderChange(index, 'meetDate', e.target.value)}
                required
              />

              <TextField
                label="What aspects can your referee evaluate about you?"
                select
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={recommender.evalAspects}
                onChange={(e) => handleRecommenderChange(index, 'evalAspects', e.target.value)}
                required
                SelectProps={{
                  multiple: true
                }}
              >
                {evalAspectsOptions.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </TextField>

              {recommender.evalAspects?.includes('Other') && (
                <TextField
                  label="If 'Other,' specify"
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                  value={recommender.evalAspectsOther}
                  onChange={(e) => handleRecommenderChange(index, 'evalAspectsOther', e.target.value)}
                  required
                />
              )}

              {recommender.type === 'Independent' && (
                <TextField
                  label="If your referee is an independent referee, what specific aspects can they evaluate about you?"
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                  value={recommender.independentEval}
                  onChange={(e) => handleRecommenderChange(index, 'independentEval', e.target.value)}
                  multiline
                  rows={2}
                />
              )}

              <TextField
                label="Please briefly describe the referee's characteristics"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={recommender.characteristics}
                onChange={(e) => handleRecommenderChange(index, 'characteristics', e.target.value)}
                multiline
                rows={2}
              />

              <TextField
                label="Relationship Backstory and Current Dynamics"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={recommender.relationshipStory}
                onChange={(e) => handleRecommenderChange(index, 'relationshipStory', e.target.value)}
                multiline
                rows={3}
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}

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

export default InfoCollRecommender; 