import React, { useState, useEffect } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { taskApi } from '../../services/api';
import TaskForm from '../../components/TaskForm';
import { AxiosResponse } from 'axios';

interface RecommendationLetter {
  id?: number;
  refereeId?: number;
  clientCaseId: number;
  refereeName: string;
  rlDraft: string;
  rlOverallFeedback: string;
  rlConfirm: string;
  rlSignedLetter: string;
}

const TaskRecommendationLetters = ({ clientCaseId }: { clientCaseId: number }) => {
  const [letters, setLetters] = useState<RecommendationLetter[]>([]);

  useEffect(() => {
    if (clientCaseId) {
      taskApi.getRecommendationLetters(clientCaseId).then(res => {
        if (res && res.data) {
          setLetters(res.data);
        }
      }).catch(() => {
        // 可以加错误提示
      });
    }
  }, [clientCaseId]);

  // 检查是否所有之前的推荐信都Approved
  const canEditLetter = (index: number) => {
    return letters.slice(0, index).every(letter => letter.rlConfirm === 'YES');
  };

  const handleSubmit = async (data: RecommendationLetter, index: number) => {
    const updatedLetters = letters.map((l, i) => 
      i === index ? { ...l, ...data } : l
    );
    
    return taskApi.submitRecommendationLetters(updatedLetters);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Recommendation Letters</Typography>
      
      {letters.map((letter, index) => (
        <Accordion 
          key={letter.refereeName} 
          sx={{ mb: 2 }}
          disabled={!canEditLetter(index)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight={600}>
              Recommendation Letter for {letter.refereeName}
              {letter.rlConfirm === 'YES' && (
                <Typography component="span" sx={{ ml: 2, color: 'success.main' }}>
                  (Confirmed)
                </Typography>
              )}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TaskForm
              title=""
              clientCaseId={clientCaseId}
              initialData={letter}
              draftField="rlDraft"
              draftType="file"
              feedbackField="rlOverallFeedback"
              confirmationField="rlConfirm"
              uploadField="rlSignedLetter"
              onSubmit={(data) => handleSubmit(data, index)}
              onFetch={async (id) => {
                const res = await taskApi.getRecommendationLetters(id);
                if (res && res.data) {
                  const currentLetter = res.data.find((l: RecommendationLetter) => l.refereeName === letter.refereeName);
                  if (currentLetter) {
                    return {
                      ...res,
                      data: currentLetter
                    } as AxiosResponse;
                  }
                }
                return res;
              }}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default TaskRecommendationLetters; 