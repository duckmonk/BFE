import React from 'react';
import { taskApi } from '../../services/api';
import TaskForm from '../../components/TaskForm';

const TaskNationalImportance = ({ clientCaseId }: { clientCaseId: number }) => {
  return (
    <TaskForm
      title="National Importance"
      clientCaseId={clientCaseId}
      draftField="prong1NiDraft"
      feedbackField="prong1NiOverall"
      confirmationField="prong1NiConfirmation"
      onSubmit={taskApi.submitNationalImportance}
      onFetch={taskApi.getNationalImportance}
    />
  );
};

export default TaskNationalImportance; 