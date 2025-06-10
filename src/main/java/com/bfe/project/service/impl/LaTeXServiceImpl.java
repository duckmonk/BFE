package com.bfe.project.service.impl;

import com.bfe.project.service.LaTeXService;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;

@Service
public class LaTeXServiceImpl implements LaTeXService {

    @Override
    public byte[] convertLatexToPdf(String latexContent, String clsContent) throws IOException, InterruptedException {
        Path tempDir = null;
        try {
            // 1. 创建临时目录
            tempDir = Files.createTempDirectory("latex_compile");
            Path texFile = tempDir.resolve("input.tex");
            Path pdfFile = tempDir.resolve("input.pdf");

            // 2. 如果有cls内容，创建临时.cls文件
            if (clsContent != null && !clsContent.trim().isEmpty()) {
                Path clsFile = tempDir.resolve("pl_template.cls");
                Files.write(clsFile, clsContent.getBytes());
            }

            // 3. 将 LaTeX 内容写入 .tex 文件
            Files.write(texFile, latexContent.getBytes());

            // 4. 构建并执行 pdflatex 命令
            ProcessBuilder pb = new ProcessBuilder("pdflatex", "-interaction=nonstopmode", texFile.toAbsolutePath().toString());
            pb.directory(tempDir.toFile()); // 设置工作目录
            pb.redirectErrorStream(true); // 合并标准错误和标准输出

            Process process = pb.start();
            int exitCode = process.waitFor();

            // 读取进程输出（用于调试）
            try (InputStream is = process.getInputStream()) {
                String processOutput = new String(is.readAllBytes());
                System.out.println("pdflatex output:\n" + processOutput);
            }

            // 5. 检查 pdflatex 是否成功
            if (exitCode != 0) {
                throw new IOException("pdflatex compilation failed with exit code " + exitCode);
            }

            // 6. 读取生成的 .pdf 文件
            if (!Files.exists(pdfFile)) {
                 throw new IOException("pdflatex did not produce a PDF file.");
            }

            return Files.readAllBytes(pdfFile);

        } finally {
            // 7. 清理临时目录
            if (tempDir != null && Files.exists(tempDir)) {
                try {
                    Files.walk(tempDir)
                         .sorted(Comparator.reverseOrder()) // 倒序排列，先删除文件再删除目录
                         .forEach(p -> {
                             try {
                                 Files.delete(p);
                             } catch (IOException e) {
                                 System.err.println("Failed to delete temporary file/directory: " + p + " - " + e.getMessage());
                             }
                         });
                } catch (IOException e) {
                    System.err.println("Failed to clean up temporary directory: " + tempDir + " - " + e.getMessage());
                }
            }
        }
    }
} 