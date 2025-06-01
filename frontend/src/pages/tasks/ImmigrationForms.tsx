import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import FileUploadButton from '../../components/FileUploadButton';
import { clientCaseApi } from '../../services/api';
import { extractFileName } from '../../services/s3Service';

interface ImmigrationFormsProps {
  clientCaseId: number;
}

const ImmigrationForms: React.FC<ImmigrationFormsProps> = ({ clientCaseId }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch data on component mount and when clientCaseId changes
  useEffect(() => {
    if (clientCaseId) {
      const fetchImmigrationForms = async () => {
        try {
          console.log('Fetching immigration forms for case:', clientCaseId);
          const response = await clientCaseApi.getCaseById(clientCaseId);
          console.log('Case response:', response.data);
          if (response.data && response.data.immigrationForms) {
            console.log('Found immigration forms URL:', response.data.immigrationForms);
            setFileUrl(response.data.immigrationForms);
          } else {
            console.log('No immigration forms URL found');
            setFileUrl(null);
          }
        } catch (error) {
          console.error('Failed to fetch immigration forms data:', error);
          setFileUrl(null);
        }
      };
      fetchImmigrationForms();
    } else {
      setFileUrl(null);
    }
  }, [clientCaseId]);

  const handleFileUrlChange = (url: string | null) => {
    console.log('File URL changed:', url);
    setFileUrl(url);
  };

  const handleSave = async () => {
    if (!clientCaseId) {
      alert('Case ID is not available.');
      return;
    }
    setLoading(true);
    try {
      console.log('Saving immigration forms URL:', fileUrl);
      const updatedCase = {
        id: clientCaseId,
        immigrationForms: fileUrl
      };
      console.log('Updating case with:', updatedCase);
      await clientCaseApi.update(updatedCase);
      console.log('Immigration forms saved successfully');
      alert('Immigration Forms saved successfully!');
    } catch (error) {
      console.error('Failed to save immigration forms:', error);
      alert('Failed to save immigration forms.');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Immigration Forms</Typography>
      
      <FileUploadButton
        label="Upload Immigration Forms (PDF)"
        fileType="immigrationForms"
        onFileUrlChange={handleFileUrlChange}
        required={false}
        fileUrl={fileUrl}
        fileName={fileUrl ? extractFileName(fileUrl) : undefined}
      />

       <Box sx={{ mt: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
          disabled={loading || !clientCaseId}
        >
          {loading ? 'Saving...' : 'Save Forms'}
        </Button>
      </Box>
    </Box>
  );
};

export default ImmigrationForms; 