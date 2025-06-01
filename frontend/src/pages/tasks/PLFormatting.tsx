import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, Grid } from '@mui/material';
import { latexApi } from '../../services/api';

const PLFormatting: React.FC = () => {
  const [latex, setLatex] = useState('');
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLatexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLatex(event.target.value);
  };

  const handleRender = async () => {
    setLoading(true);
    setImgUrl(null);
    setPdfBlob(null);
    try {
      const result = await latexApi.renderLatex(latex);

      // 处理PNG
      const pngBlob = base64ToBlob(result.png, 'image/png');
      const pngUrl = window.URL.createObjectURL(pngBlob);
      setImgUrl(pngUrl);

      // 处理PDF
      const pdfBlob = base64ToBlob(result.pdf, 'application/pdf');
      setPdfBlob(pdfBlob);
    } catch (error) {
      alert('渲染失败，请检查LaTeX语法');
    }
    setLoading(false);
  };

  // base64转Blob
  function base64ToBlob(base64: string, mime: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
  }

  const handleDownloadImg = () => {
    if (!imgUrl) return;
    const link = document.createElement('a');
    link.href = imgUrl;
    link.setAttribute('download', 'formula.png');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDownloadPDF = () => {
    if (!pdfBlob) return;
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'formula.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>PL Formatting</Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>LaTeX Editor</Typography>
            <TextField
              fullWidth
              multiline
              rows={10}
              value={latex}
              onChange={handleLatexChange}
              placeholder="输入LaTeX公式..."
              variant="outlined"
            />
            <Button
              variant="contained"
              sx={{ mt: 2, bgcolor: '#000', color: '#fff', '&:hover': { bgcolor: '#333' } }}
              onClick={handleRender}
              disabled={loading || !latex}
            >
              {loading ? '渲染中...' : '渲染'}
            </Button>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Preview</Typography>
            {imgUrl ? (
              <>
                <img src={imgUrl} alt="LaTeX Preview" style={{ maxWidth: '100%', maxHeight: 200 }} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="outlined" sx={{ mt: 2 }} onClick={handleDownloadImg}>下载图片</Button>
                  <Button variant="outlined" sx={{ mt: 2 }} onClick={handleDownloadPDF} disabled={!pdfBlob}>下载PDF</Button>
                </Box>
              </>
            ) : (
              <Typography color="text.secondary">请先输入LaTeX并点击渲染</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PLFormatting; 