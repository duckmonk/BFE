package com.bfe.project.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class PdfMergeService {
    private static final Logger logger = LoggerFactory.getLogger(PdfMergeService.class);

    @Autowired
    private LaTeXService latexService;

    public byte[] mergePdfs(String latexContent, byte[] immigrationFormsPdf) throws IOException, InterruptedException {
        List<byte[]> pdfBytes = new ArrayList<>();
        
        try {
            // 1. 转换LaTeX为PDF
            logger.info("Converting LaTeX to PDF...");
            byte[] latexPdf = latexService.convertLatexToPdf(latexContent);
            if (latexPdf == null || latexPdf.length == 0) {
                throw new IOException("LaTeX conversion resulted in empty PDF");
            }
            pdfBytes.add(latexPdf);
            logger.info("LaTeX conversion successful, PDF size: {} bytes", latexPdf.length);
            
            // 2. 添加immigration forms PDF
            if (immigrationFormsPdf == null || immigrationFormsPdf.length == 0) {
                throw new IOException("Immigration forms PDF is empty");
            }
            pdfBytes.add(immigrationFormsPdf);
            logger.info("Immigration forms PDF size: {} bytes", immigrationFormsPdf.length);
            
            // 3. 合并PDFs
            logger.info("Starting PDF merge...");
            ByteArrayOutputStream mergedPdf = new ByteArrayOutputStream();
            PdfDocument mergedDoc = new PdfDocument(new PdfWriter(mergedPdf));
            
            for (byte[] pdf : pdfBytes) {
                try (PdfReader reader = new PdfReader(new ByteArrayInputStream(pdf));
                     PdfDocument sourceDoc = new PdfDocument(reader)) {
                    sourceDoc.copyPagesTo(1, sourceDoc.getNumberOfPages(), mergedDoc);
                }
            }
            
            mergedDoc.close();
            byte[] result = mergedPdf.toByteArray();
            logger.info("PDF merge successful, final size: {} bytes", result.length);
            return result;
            
        } catch (Exception e) {
            logger.error("Error during PDF merge process", e);
            throw e;
        }
    }
} 