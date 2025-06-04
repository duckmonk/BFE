import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, Grid, Modal, Backdrop, Fade, IconButton } from '@mui/material';
import { clientCaseApi } from '../../services/api';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const [textItems, setTextItems] = useState<string[]>(['']);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  console.log('PLFormatting state - loading:', loading, 'textItems:', textItems, 'clientCaseId prop:', clientCaseId);

  // Fetch data on component mount and when clientCaseId changes
  useEffect(() => {
    if (clientCaseId) {
      const fetchPlFormatting = async () => {
        try {
          const response = await clientCaseApi.getCaseById(clientCaseId);
          if (response.data && response.data.plFormatting) {
            // 从后端获取文本列表
            const items = response.data.plFormatting.split('\\par').filter((item: string) => item.trim());
            setTextItems(items.length > 0 ? items : ['']);
          } else {
            setTextItems(['']);
          }
        } catch (error) {
          console.error('Failed to fetch plFormatting data:', error);
          setTextItems(['']);
        }
      };
      fetchPlFormatting();
    } else {
      setTextItems(['']);
    }
  }, [clientCaseId]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    // Clean up the object URL when modal is closed
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null); // Clear the URL after revoking
    }
  };

  const handleTextChange = (index: number, value: string) => {
    const newItems = [...textItems];
    newItems[index] = value;
    setTextItems(newItems);
  };

  const handleAddItem = () => {
    setTextItems([...textItems, '']);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = textItems.filter((_, i) => i !== index);
    setTextItems(newItems.length > 0 ? newItems : ['']);
  };

  const handleRender = async () => {
    if (!clientCaseId) {
      alert('Case ID is not available.');
      return;
    }
    setLoading(true);
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    try {
      // 只发送文本列表到后端
      const textList = textItems.filter(item => item.trim());
      const pdfBlob = await clientCaseApi.saveAndPreviewLatex(clientCaseId, textList);
      const url = window.URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      handleOpenModal();
    } catch (error) {
      console.error('Rendering failed:', error);
      alert('Rendering failed, please check the content and ensure backend is running.');
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
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Document Content</Typography>
            {textItems.map((text, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={text}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  placeholder="Enter text content..."
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                <IconButton 
                  onClick={() => handleDeleteItem(index)}
                  // disabled={textItems.length === 1}
                  sx={{ mt: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddItem}
              sx={{ mb: 2 }}
            >
              Add Section
            </Button>
            <Button
              variant="contained"
              sx={{ mt: 2, bgcolor: '#000', color: '#fff', '&:hover': { bgcolor: '#333' } }}
              onClick={handleRender}
              disabled={loading || !textItems.some(item => item.trim()) || !clientCaseId}
            >
              {loading ? 'Rendering...' : 'Save and preview'}
            </Button>
          </Paper>
        </Grid>
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