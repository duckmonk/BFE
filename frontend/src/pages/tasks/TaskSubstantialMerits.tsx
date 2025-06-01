import React from 'react';
import { taskApi } from '../../services/api';
import TaskForm from '../../components/TaskForm';

const TaskSubstantialMerits = ({ clientCaseId }: { clientCaseId: number }) => {
  return (
    <TaskForm
      title="Substantial Merits"
      clientCaseId={clientCaseId}
      draftField="prong1SmDraft"
      feedbackField="prong1SmOverall"
      confirmationField="prong1SmConfirm"
      onSubmit={taskApi.submitSubstantialMerits}
      onFetch={taskApi.getSubstantialMerits}
    />
  );
};

export default TaskSubstantialMerits; 