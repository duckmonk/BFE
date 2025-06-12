import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Paper, Typography, Grid, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert, AlertTitle, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { clientCaseApi } from '../../services/api';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface PLFormattingProps {
  clientCaseId: number;
}

const PLFormatting: React.FC<PLFormattingProps> = ({ clientCaseId }) => {
  const [latexContent, setLatexContent] = useState<string>('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [typeOfPetition, setTypeOfPetition] = useState<string>('');
  const [exhibitList, setExhibitList] = useState<string[]>(['']);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info',
    title: '',
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    onConfirm: () => {},
  });
  const [plFormattingCls, setPlFormattingCls] = useState<string>('');
  const hasAutoPreview = useRef(false);
  const [premiumProcess, setPremiumProcess] = useState('NO');
  const [mailingService, setMailingService] = useState('U.S. Postal Service (USPS)');
  const [beneficiaryWorkState, setBeneficiaryWorkState] = useState('No U.S. employment');
  const usStates = [
    'No U.S. employment', 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Marshall Islands', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'US Virgin Islands', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Armed Forces'
  ];
  const [pdfError, setPdfError] = useState<string | null>(null);

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
            if (response.data.exhibitList) {
              setExhibitList(response.data.exhibitList);
            }
            if (response.data.premiumProcess) setPremiumProcess(response.data.premiumProcess);
            if (response.data.mailingService) setMailingService(response.data.mailingService);
            if (response.data.beneficiaryWorkState) setBeneficiaryWorkState(response.data.beneficiaryWorkState);
          }
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      };
      fetchData();
      hasAutoPreview.current = false;
    }
  }, [clientCaseId]);

  const handleExhibitChange = (index: number, value: string) => {
    const newList = [...exhibitList];
    newList[index] = value;
    setExhibitList(newList);
  };

  const handleAddExhibit = () => {
    setExhibitList([...exhibitList, '']);
  };

  const handleDeleteExhibit = (index: number) => {
    const newList = exhibitList.filter((_, i) => i !== index);
    setExhibitList(newList);
  };

  // 初始化 LaTeX
  const handleInitLatex = async () => {
    if (!clientCaseId || !typeOfPetition) {
      setSnackbar({ 
        open: true, 
        message: 'Please select Type of Petition first.', 
        severity: 'error', 
        title: 'Input Required' 
      });
      return;
    }

    // 检查是否已有内容
    if (latexContent && latexContent.trim()) {
      setConfirmDialog({
        open: true,
        onConfirm: async () => {
          await initializeLatex();
        }
      });
    } else {
      await initializeLatex();
    }
  };

  const initializeLatex = async () => {
    setInitLoading(true);
    try {
      const response = await clientCaseApi.initLatex(clientCaseId, typeOfPetition, exhibitList, premiumProcess, mailingService, beneficiaryWorkState);
      // 判断返回内容类型
      if (typeof response.data === 'string') {
        setLatexContent(response.data);
        setSnackbar({ 
          open: true, 
          message: 'LaTeX content initialized successfully.', 
          severity: 'success', 
          title: 'Success' 
        });
      } else if (response.data && response.data.status === 'error') {
        setSnackbar({
          open: true,
          message: response.data.message || 'Failed to initialize LaTeX content.',
          severity: 'error',
          title: 'Error',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Unexpected response from server.',
          severity: 'error',
          title: 'Error',
        });
      }
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to initialize LaTeX content.',
        severity: 'error',
        title: 'Error',
      });
    }
    setInitLoading(false);
    setConfirmDialog({ open: false, onConfirm: () => {} });
  };

  // 保存并预览
  const handleSave = async () => {
    if (!clientCaseId || !latexContent.trim()) {
      setSnackbar({ open: true, message: 'Please enter LaTeX content.', severity: 'error', title: 'Input Required' });
      return;
    }
    setLoading(true);
    setPdfError(null);
    try {
      const pdfBlob = await clientCaseApi.saveAndPreviewLatex(clientCaseId, latexContent);
      const contentType = pdfBlob.type || '';
      if (contentType.includes('pdf')) {
        setSnackbar({ open: true, message: 'Your document was saved and rendered successfully.', severity: 'success', title: 'Success' });
        if (pdfUrl) {
          window.URL.revokeObjectURL(pdfUrl);
          setPdfUrl(null);
        }
        const url = window.URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
      } else {
        const text = await pdfBlob.text();
        let errorMsg = text;
        try {
          const json = JSON.parse(text);
          if (json.status === 'error' && json.message) {
            errorMsg = json.message;
          }
        } catch {}
        setPdfError(errorMsg);
        setPdfUrl(null);
      }
    } catch (error: any) {
      setPdfError(error.message || 'Failed to save or render.');
      setPdfUrl(null);
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
      height: '90vh',
      position: 'relative'
    }}>
      {/* 左侧编辑区域 */}
      <Box sx={{ 
        flex: 1,
        p: 3,
        overflow: 'auto',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">PL Formatting</Typography>
        </Box>

        <Grid container spacing={3} direction="column" sx={{ flex: 1 }}>
          {/* 配置区域 */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                LaTeX Variables
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ width: '300px', minWidth: '300px' }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Type of Petition
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={typeOfPetition}
                        onChange={(e) => setTypeOfPetition(e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>Select type</MenuItem>
                        <MenuItem value="I-140, EB-2 National Interest Waiver">I-140, EB-2 National Interest Waiver</MenuItem>
                        <MenuItem value="I-140, EB-1A Alien of Extraordinary Ability">I-140, EB-1A Alien of Extraordinary Ability</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box sx={{ flex: 1, maxWidth: '600px' }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Exhibit List</Typography>
                    {exhibitList.map((exhibit, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <TextField
                          fullWidth
                          value={exhibit}
                          onChange={(e) => handleExhibitChange(index, e.target.value)}
                          placeholder="Enter exhibit description..."
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <IconButton 
                          onClick={() => handleDeleteExhibit(index)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={handleAddExhibit}
                      size="small"
                    >
                      Add Exhibit
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Premium Process</InputLabel>
                    <Select value={premiumProcess} label="Premium Process" onChange={e => setPremiumProcess(e.target.value)}>
                      <MenuItem value="YES">YES</MenuItem>
                      <MenuItem value="NO">NO</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: 220 }}>
                    <InputLabel>Mailing Service</InputLabel>
                    <Select value={mailingService} label="Mailing Service" onChange={e => setMailingService(e.target.value)}>
                      <MenuItem value="U.S. Postal Service (USPS)">U.S. Postal Service (USPS)</MenuItem>
                      <MenuItem value="FedEx, UPS, and DHL deliveries">FedEx, UPS, and DHL deliveries</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: 220 }}>
                    <InputLabel>Work State</InputLabel>
                    <Select value={beneficiaryWorkState} label="Work State" onChange={e => setBeneficiaryWorkState(e.target.value)}>
                      {usStates.map(state => <MenuItem key={state} value={state}>{state}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleInitLatex}
                    disabled={initLoading || !typeOfPetition}
                    sx={{ 
                      bgcolor: '#000', 
                      color: '#fff', 
                      '&:hover': { bgcolor: '#333' },
                      width: '200px'
                    }}
                  >
                    {initLoading ? 'Initializing...' : 'Init LaTeX Content'}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12 }} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Paper sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>LaTeX Content</Typography>
              <TextField
                fullWidth
                multiline
                value={latexContent}
                onChange={(e) => setLatexContent(e.target.value)}
                placeholder="LaTeX content will appear here after initialization..."
                variant="outlined"
                sx={{ 
                  flex: 1,
                  mb: 2,
                  '& .MuiInputBase-root': {
                    height: '100%',
                    '& textarea': {
                      height: '100% !important',
                      overflow: 'auto !important',
                      resize: 'none'
                    }
                  }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                  Please re-initialize LaTeX content if you have changed LaTeX variables or information collection data.
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={loading}
                  sx={{ bgcolor: '#000', color: '#fff', '&:hover': { bgcolor: '#333' } }}
                >
                  {loading ? 'Rendering...' : 'Save and Preview'}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* 右侧PDF预览区域 */}
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
          {pdfUrl && (
            <Button onClick={handleDownloadPDF} variant="outlined" size="small">
              Download PDF
            </Button>
          )}
        </Box>
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {pdfError ? (
            <Box sx={{ color: 'error.main', whiteSpace: 'pre-wrap', p: 2, maxHeight: '100%', overflow: 'auto', width: '100%' }}>
              {pdfError}
            </Box>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="PDF Preview"
            />
          ) : (
            <Typography color="text.secondary">
              PDF preview will appear here after rendering
            </Typography>
          )}
        </Box>
      </Box>

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

      {/* 确认对话框 */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, onConfirm: () => {} })}
      >
        <DialogTitle>Confirm Initialization</DialogTitle>
        <DialogContent>
          <Typography>
            Current LaTeX content will be reset. Are you sure you want to continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, onConfirm: () => {} })}>
            Cancel
          </Button>
          <Button onClick={confirmDialog.onConfirm} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PLFormatting; 