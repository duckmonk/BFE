import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Box, Typography, IconButton, Dialog, DialogContent, DialogActions, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { uploadFileToS3 } from '../services/s3Service';

interface FileUploadButtonProps {
  label: string;
  fileType: string;
  onUploadSuccess?: (fileUrl: string) => void;
  onUploadError?: (error: any) => void;
  onFileUrlChange?: (fileUrl: string | null) => void;
  accept?: string;
  disabled?: boolean;
  required?: boolean;
  fileUrl?: string | null;
  fileName?: string | null;
  error?: boolean;
  disableDelete?: boolean;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  label,
  fileType,
  onUploadSuccess,
  onUploadError,
  onFileUrlChange,
  accept = 'application/pdf',
  disabled = false,
  required = false,
  fileUrl: propFileUrl,
  fileName: propFileName,
  error = false,
  disableDelete = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(propFileUrl || null);
  const [fileName, setFileName] = useState<string | null>(propFileName || (propFileUrl ? propFileUrl.split('/').pop()! : null));
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    setFileUrl(propFileUrl || null);
    setFileName(propFileName || (propFileUrl ? propFileUrl.split('/').pop()! : null));
  }, [propFileUrl, propFileName]);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    try {
      setIsUploading(true);
      setFileName(file.name);
      
      // 生成唯一的文件名
      const timestamp = new Date().getTime();
      const key = `documents/${fileType}/${timestamp}-${file.name}`;
      
      // 上传文件到S3
      const uploadedFileUrl = await uploadFileToS3(file, key);
      
      // 更新状态
      setFileUrl(uploadedFileUrl);
      onFileUrlChange?.(uploadedFileUrl);
      onUploadSuccess?.(uploadedFileUrl);
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      onUploadError?.(error);
      setFileName(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = () => {
    setFileName(null);
    setFileUrl(null);
    onFileUrlChange?.(null);
  };

  const handlePreview = () => {
    setPreviewOpen(true);
    setPreviewError(null);
    setIsPreviewLoading(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewError(null);
  };

  const handlePreviewLoad = () => {
    setIsPreviewLoading(false);
  };

  const handlePreviewError = () => {
    setIsPreviewLoading(false);
    setPreviewError('Cannot load preview, please try to download the file to view.');
  };

  const handleDownload = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="subtitle2"
        color={error ? 'error' : required ? 'primary' : 'text.secondary'}
        sx={{ mb: 0.5, fontWeight: 500 }}
      >
        {label}{required && ' *'}
      </Typography>

      {!fileUrl && (
        <Button
          variant="outlined"
          component="label"
          disabled={disabled || isUploading}
          sx={{ 
            width: '100%', 
            justifyContent: 'flex-start',
            borderColor: error ? 'error.main' : undefined,
            '&:hover': {
              borderColor: error ? 'error.main' : undefined,
            }
          }}
        >
          {isUploading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              Choose PDF file
              <input
                type="file"
                accept={accept}
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </>
          )}
        </Button>
      )}
      
      {fileName && fileUrl && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mt: 1,
          p: 1,
          bgcolor: 'background.paper',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="body2" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {fileName}
          </Typography>
          <IconButton 
            size="small" 
            onClick={handlePreview}
            sx={{ ml: 1 }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={handleDownload}
            sx={{ ml: 1 }}
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
          {!disableDelete && (
            <IconButton 
              size="small" 
              onClick={handleDelete}
              sx={{ ml: 1 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}

      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0, height: '80vh', position: 'relative' }}>
          {isPreviewLoading && (
            <Box sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              zIndex: 1
            }}>
              <CircularProgress />
            </Box>
          )}
          
          {previewError && (
            <Box sx={{ p: 2 }}>
              <Alert severity="error">{previewError}</Alert>
            </Box>
          )}

          {fileUrl && !previewError && (
            <iframe
              src={`${fileUrl}#toolbar=0`}
              style={{ 
                width: '100%', 
                height: '100%', 
                border: 'none',
                visibility: isPreviewLoading ? 'hidden' : 'visible'
              }}
              title="PDF Preview"
              onLoad={handlePreviewLoad}
              onError={handlePreviewError}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Close</Button>
          <Button 
            onClick={handleDownload}
            startIcon={<DownloadIcon />}
          >
            Download file
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileUploadButton; 