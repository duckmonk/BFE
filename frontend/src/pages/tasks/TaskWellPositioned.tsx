import React from 'react';
import { taskApi } from '../../services/api';
import TaskForm from '../../components/TaskForm';

const TaskWellPositioned = ({ clientCaseId }: { clientCaseId: number }) => {
  return (
    <TaskForm
      title="Well Positioned"
      clientCaseId={clientCaseId}
      draftField="prong2WpDraft"
      feedbackField="prong2WpOverall"
      confirmationField="prong2WpConfirm"
      onSubmit={taskApi.submitWellPositioned}
      onFetch={taskApi.getWellPositioned}
    />
  );
};

export default TaskWellPositioned; 