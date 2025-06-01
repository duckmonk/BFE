import React, { useState, useEffect } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { taskApi } from '../../services/api';
import TaskForm from '../../components/TaskForm';

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
          setLetters(res.data.map((letter: any) => ({
            id: letter.id,
            refereeId: letter.refereeId,
            clientCaseId: letter.clientCaseId,
            refereeName: letter.refereeName,
            rlDraft: letter.recommendationLetter || '',
            rlOverallFeedback: letter.feedback || '',
            rlConfirm: letter.confirm || '',
            rlSignedLetter: letter.signedLetter || ''
          })));
        }
      }).catch(() => {
        // 可以加错误提示
      });
    }
  }, [clientCaseId]);

  // 检查是否所有之前的推荐信都已确认
  const canEditLetter = (index: number) => {
    return letters.slice(0, index).every(letter => letter.rlConfirm === 'YES');
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
                  (已确认)
                </Typography>
              )}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TaskForm
              title={`Recommendation Letter for ${letter.refereeName}`}
              clientCaseId={clientCaseId}
              initialData={letter}
              draftField="rlDraft"
              feedbackField="rlOverallFeedback"
              confirmationField="rlConfirm"
              uploadField="rlSignedLetter"
              onSubmit={async (data) => {
                const updatedLetters = letters.map((l, i) => 
                  i === index ? { ...l, ...data } : l
                );
                return taskApi.submitRecommendationLetters(updatedLetters);
              }}
              onFetch={taskApi.getRecommendationLetters}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default TaskRecommendationLetters; 