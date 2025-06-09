import React from 'react';
import { Alert } from '@mui/material';

interface InfoCollAlertProps {
  userType: string;
}

const InfoCollAlert: React.FC<InfoCollAlertProps> = ({ userType }) => {
  if (userType !== 'client') {
    return null;
  }

  return (
    <Alert severity="warning" sx={{ mb: 2 }}>
      Reminder: If you do not click Save, your changes will be lost.
    </Alert>
  );
};

export default InfoCollAlert; 