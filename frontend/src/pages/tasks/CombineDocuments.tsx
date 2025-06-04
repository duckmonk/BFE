import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, DialogContent, DialogActions, Backdrop, Fade } from '@mui/material';
import { clientCaseApi } from '../../services/api';

// Modal style
const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  height: '90%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
};

interface CombineDocumentsProps {
    clientCaseId: number;
    immigrationForms: string | null;
}

const CombineDocuments: React.FC<CombineDocumentsProps> = ({ clientCaseId, immigrationForms }) => {
    const [open, setOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handlePreview = async () => {
        if (!clientCaseId) {
            console.error('No client case ID provided');
            return;
        }

        if (!immigrationForms) {
            console.error('No immigration forms URL provided');
            return;
        }

        setLoading(true);
        try {
            console.log('Starting PDF combination process...');
            console.log('Immigration forms URL:', immigrationForms);
            
            // 1. 从AWS下载immigration forms PDF
            console.log('Downloading immigration forms PDF...');
            const immigrationFormsResponse = await fetch(immigrationForms, {
                method: 'GET',
                headers: {
                    'Accept': 'application/pdf',
                    'Content-Type': 'application/pdf'
                },
                mode: 'cors',
                credentials: 'omit'
            });
            
            console.log('Download response status:', immigrationFormsResponse.status);
            
            if (!immigrationFormsResponse.ok) {
                throw new Error('Failed to download immigration forms PDF');
            }
            
            // 2. 获取PDF blob
            console.log('Converting response to blob...');
            const immigrationFormsBlob = await immigrationFormsResponse.blob();
            console.log('Blob size:', immigrationFormsBlob.size);
            console.log('Blob type:', immigrationFormsBlob.type);
            
            // 3. 创建FormData并添加文件
            console.log('Creating FormData...');
            const formData = new FormData();
            formData.append('immigrationForms', immigrationFormsBlob, 'immigration_forms.pdf');
            
            // 4. 调用后端API合并PDF
            console.log('Calling backend API to combine PDFs...');
            const response = await clientCaseApi.getCombinedPdf(clientCaseId, formData);
            console.log('Backend response received');
            
            if (!response.data) {
                throw new Error('No data received from server');
            }

            const blob = new Blob([response.data], { type: 'application/pdf' });
            console.log('Created blob:', blob);
            
            const url = URL.createObjectURL(blob);
            console.log('Created preview URL:', url);
            
            setPreviewUrl(url);
            setOpen(true);
        } catch (error) {
            console.error('Error combining PDFs:', error);
            alert('Failed to combine PDFs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    const handleDownloadPDF = () => {
        if (!previewUrl) return;
        const link = document.createElement('a');
        link.href = previewUrl;
        link.setAttribute('download', 'combined_document.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    console.log('loading:', loading, 'clientCaseId:', clientCaseId, 'immigrationForms:', immigrationForms);

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Combine Documents</Typography>
            
            <Button
                variant="contained"
                color="primary"
                onClick={handlePreview}
                disabled={loading || !clientCaseId || !immigrationForms}
            >
                {loading ? 'Loading...' : 'Preview Combined PDF'}
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="lg"
                fullWidth
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <DialogContent sx={{ p: 0, height: '80vh', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" component="h2" sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                        Combined PDF Preview
                    </Typography>
                    <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                        {previewUrl && (
                            <iframe
                                src={previewUrl}
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    border: 'none',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                }}
                                title="Combined PDF Preview"
                            />
                        )}
                    </Box>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e0e0e0' }}>
                        <Button onClick={handleDownloadPDF} variant="outlined" sx={{ mr: 1 }}>
                            Download PDF
                        </Button>
                        <Button onClick={handleClose} variant="contained">
                            Close
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default CombineDocuments; 