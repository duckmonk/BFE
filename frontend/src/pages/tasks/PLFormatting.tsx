import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, Grid, Modal, Backdrop, Fade } from '@mui/material';
import {  clientCaseApi } from '../../services/api';

// Modal style
const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%', // Adjusted width
  height: '90%', // Adjusted height
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex', // Use flexbox for content
  flexDirection: 'column', // Stack items vertically
};

const PLFormatting: React.FC<{ clientCaseId: number }> = ({ clientCaseId }) => {
  const [latex, setLatex] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null); // Keep pdfUrl for modal and download
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false); // New state for modal visibility

  console.log('PLFormatting state - loading:', loading, 'latex:', latex, 'clientCaseId prop:', clientCaseId);

  // Fetch data on component mount and when clientCaseId changes
  useEffect(() => {
    console.log('useEffect triggered - clientCaseId:', clientCaseId);
    if (clientCaseId) {
      const fetchPlFormatting = async () => {
        try {
          console.log('Fetching plFormatting for case ID:', clientCaseId);
          // Assuming clientCaseApi.getCaseById returns the case object including plFormatting
          const response = await clientCaseApi.getCaseById(clientCaseId);
          console.log('Case data response:', response.data);
          if (response.data && response.data.plFormatting) {
            setLatex(response.data.plFormatting);
            console.log('Set latex from fetched data:', response.data.plFormatting);
          } else {
             console.log('No plFormatting data found for this case.');
             setLatex(''); // Clear latex if no data found
          }
        } catch (error) {
          console.error('Failed to fetch plFormatting data:', error);
          // Optionally set an error state or display a message
        }
      };
      fetchPlFormatting();
    } else {
        setLatex(''); // Clear latex if clientCaseId is null/undefined
    }
  }, [clientCaseId]); // Re-run effect when clientCaseId changes

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    // Clean up the object URL when modal is closed
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null); // Clear the URL after revoking
    }
  };

  const handleLatexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLatex(event.target.value);
  };

  const handleRender = async () => {
    if (!clientCaseId) {
      alert('Case ID is not available.');
      return;
    }
    setLoading(true);
    if (pdfUrl) { // Clean up previous URL if exists
      window.URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    try {
      // Using latex.trim() as per the last accepted change
      const fullLatexContent = latex.trim(); 
      console.log('Sending LaTeX content for case ID '+ clientCaseId + ':', fullLatexContent);

      // Call the new save and preview endpoint using clientCaseApi
      const pdfBlob = await clientCaseApi.saveAndPreviewLatex(clientCaseId, fullLatexContent);

      const url = window.URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      handleOpenModal(); // Open modal on success
    } catch (error) {
      console.error('Rendering failed:', error);
      alert('Rendering failed, please check the LaTeX syntax and ensure backend is running.');
    }
    setLoading(false);
  };

  const handleDownloadPDF = () => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', 'document.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    // No need to revoke URL here, it will be done when modal closes
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>PL Formatting</Typography>
      <Grid container spacing={3} direction="column">
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>LaTeX Editor</Typography>
            <TextField
              fullWidth
              multiline
              rows={10}
              value={latex}
              onChange={handleLatexChange}
              placeholder="Input LaTeX formula..."
              variant="outlined"
            />
            <Button
              variant="contained"
              sx={{ mt: 2, bgcolor: '#000', color: '#fff', '&:hover': { bgcolor: '#333' } }}
              onClick={handleRender}
              disabled={loading || !latex || !clientCaseId}
            >
              {loading ? 'Rendering...' : 'Save and preview'}
            </Button>
          </Paper>
        </Grid>
        {/* Removed the static preview grid item */}
      </Grid>

      {/* PDF Preview Modal */}
      <Modal
        aria-labelledby="pdf-preview-modal-title"
        aria-describedby="pdf-preview-modal-description"
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openModal}>
          <Box sx={modalStyle}>
            <Typography id="pdf-preview-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
              PDF Preview
            </Typography>
            <Box sx={{ flex: 1, minHeight: 0 }}> {/* iframe container */}
              {pdfUrl && (
                <iframe
                  src={pdfUrl}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="PDF Preview"
                />
              )}
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
               <Button onClick={handleDownloadPDF} variant="outlined" sx={{ mr: 1 }}>
                Download PDF
              </Button>
              <Button onClick={handleCloseModal} variant="contained">
                Close
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default PLFormatting; 