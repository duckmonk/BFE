import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Paper, Typography, Grid, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert, AlertTitle } from '@mui/material';
import { clientCaseApi } from '../../services/api';

interface PLFormattingProps {
  clientCaseId: number;
}

const PLFormatting: React.FC<PLFormattingProps> = ({ clientCaseId }) => {
  const [latexContent, setLatexContent] = useState<string>('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [typeOfPetition, setTypeOfPetition] = useState<string>('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
    title: '',
  });
  const [plFormattingCls, setPlFormattingCls] = useState<string>('');
  const hasAutoPreview = useRef(false);

  // Fetch data on component mount and when clientCaseId changes
  useEffect(() => {
    if (clientCaseId) {
      const fetchData = async () => {
        try {
          const response = await clientCaseApi.getCaseById(clientCaseId);
          if (response.data) {
            if (response.data.plFormatting) {
              setLatexContent(response.data.plFormatting);
            }
            if (response.data.typeOfPetition) {
              setTypeOfPetition(response.data.typeOfPetition);
            }
            if (response.data.plFormattingCls) {
              setPlFormattingCls(response.data.plFormattingCls);
            }
          }
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      };
      fetchData();
      hasAutoPreview.current = false; // 每次切换caseId时重置自动预览标志
    }
  }, [clientCaseId]);

  // 自动预览PDF逻辑
  useEffect(() => {
    if (
      latexContent && plFormattingCls &&
      !hasAutoPreview.current &&
      clientCaseId
    ) {
      hasAutoPreview.current = true;
      handleSave();
    }
  }, [latexContent, plFormattingCls, clientCaseId]);

  // 保存并预览
  const handleSave = async () => {
    if (!clientCaseId || !latexContent.trim()) {
      setSnackbar({ open: true, message: 'Please enter LaTeX content.', severity: 'error', title: 'Input Required' });
      return;
    }
    setLoading(true);
    try {
      const pdfBlob = await clientCaseApi.saveAndPreviewLatex(clientCaseId, typeOfPetition, latexContent);
      setSnackbar({ open: true, message: 'Your document was saved and rendered successfully.', severity: 'success', title: 'Success' });
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
      const url = window.URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to save or render.',
        severity: 'error',
        title: 'Error',
      });
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
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh',
      position: 'relative'
    }}>
      {/* 左侧编辑区域 */}
      <Box sx={{ 
        flex: 1,
        p: 3,
        overflow: 'auto',
        borderRight: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">PL Formatting</Typography>
        </Box>

        <Grid container spacing={3} direction="column">
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 300 }}>
                  <InputLabel>Type of Petition</InputLabel>
                  <Select
                    value={typeOfPetition}
                    label="Type of Petition"
                    onChange={(e) => setTypeOfPetition(e.target.value)}
                  >
                    <MenuItem value="I-140, EB-2 National Interest Waiver">I-140, EB-2 National Interest Waiver</MenuItem>
                    <MenuItem value="I-140, EB-1A Alien of Extraordinary Ability">I-140, EB-1A Alien of Extraordinary Ability</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={loading || !typeOfPetition}
                  sx={{ bgcolor: '#000', color: '#fff', '&:hover': { bgcolor: '#333' } }}
                >
                  {loading ? 'Rendering...' : 'Save and Preview'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>LaTeX Content</Typography>
              <TextField
                fullWidth
                multiline
                rows={20}
                value={latexContent}
                onChange={(e) => setLatexContent(e.target.value)}
                placeholder="LaTeX content will appear here after initialization..."
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* 右侧PDF预览区域 */}
      {pdfUrl && (
        <Box sx={{ 
          flex: 1,
          height: '100%',
          borderLeft: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="subtitle1">PDF Preview</Typography>
            <Button onClick={handleDownloadPDF} variant="outlined" size="small">
              Download PDF
            </Button>
          </Box>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <iframe
              src={pdfUrl}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="PDF Preview"
            />
          </Box>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          <AlertTitle>{snackbar.title}</AlertTitle>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PLFormatting; 