import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(propFileUrl || null);
  const [fileName, setFileName] = useState<string | null>(propFileName || (propFileUrl ? propFileUrl.split('/').pop()! : null));

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

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="subtitle2"
        color={required ? 'primary' : 'text.secondary'}
        sx={{ mb: 0.5, fontWeight: 500 }}
      >
        {label}{required && ' *'}
      </Typography>

      {!fileUrl && (
        <Button
          variant="outlined"
          component="label"
          disabled={disabled || isUploading}
          sx={{ width: '100%', justifyContent: 'flex-start' }}
        >
          {isUploading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              选择文件
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
            onClick={handleDelete}
            sx={{ ml: 1 }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default FileUploadButton; 