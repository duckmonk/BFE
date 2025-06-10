package com.bfe.project.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class PdfMergeService {
    public byte[] mergePdfs(byte[] mainPdf, byte[] immigrationFormsPdf, String clsContent) throws IOException {
        List<byte[]> pdfBytes = new ArrayList<>();
        pdfBytes.add(mainPdf);
        pdfBytes.add(immigrationFormsPdf);

        ByteArrayOutputStream mergedPdf = new ByteArrayOutputStream();
        PdfDocument mergedDoc = new PdfDocument(new PdfWriter(mergedPdf));

        for (byte[] pdf : pdfBytes) {
            try (PdfReader reader = new PdfReader(new ByteArrayInputStream(pdf));
                 PdfDocument sourceDoc = new PdfDocument(reader)) {
                sourceDoc.copyPagesTo(1, sourceDoc.getNumberOfPages(), mergedDoc);
            }
        }

        mergedDoc.close();
        return mergedPdf.toByteArray();
    }
} 