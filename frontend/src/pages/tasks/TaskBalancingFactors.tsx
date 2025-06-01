import React from 'react';
import { taskApi } from '../../services/api';
import TaskForm from '../../components/TaskForm';

const TaskBalancingFactors = ({ clientCaseId }: { clientCaseId: number }) => {
  return (
    <TaskForm
      title="Balancing Factors"
      clientCaseId={clientCaseId}
      draftField="prong3BfDraft"
      feedbackField="prong3BfOverall"
      confirmationField="prong3BfConfirm"
      onSubmit={taskApi.submitBalancingFactors}
      onFetch={taskApi.getBalancingFactors}
    />
  );
};

export default TaskBalancingFactors; 