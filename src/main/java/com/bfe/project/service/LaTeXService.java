package com.bfe.project.service;

import java.io.IOException;

public interface LaTeXService {
    byte[] convertLatexToPdf(String latexContent) throws IOException, InterruptedException;
} 