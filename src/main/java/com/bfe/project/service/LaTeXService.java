package com.bfe.project.service;

import java.io.IOException;

public interface LaTeXService {
    byte[] convertLatexToPdf(String latexContent, String clsContent) throws IOException, InterruptedException;
} 