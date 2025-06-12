package com.bfe.project.service.impl;

import com.bfe.project.service.LaTeXService;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.charset.StandardCharsets;
import java.util.Comparator;

@Service
public class LaTeXServiceImpl implements LaTeXService {

    @Override
    public byte[] convertLatexToPdf(String latexContent, String clsContent) throws Exception {
        Path tempDir = null;
        try {
            // 1. 创建临时目录
            tempDir = Files.createTempDirectory("latex_compile");
            Path texFile = tempDir.resolve("input.tex");
            Path pdfFile = tempDir.resolve("input.pdf");

            // 2. 如果有cls内容，创建临时.cls文件
            if (clsContent != null && !clsContent.trim().isEmpty()) {
                Path clsFile = tempDir.resolve("pl_template.cls");
                Files.write(clsFile, clsContent.getBytes(StandardCharsets.UTF_8));
            }

            // 3. 将 LaTeX 内容写入 .tex 文件
            Files.write(texFile, latexContent.getBytes(StandardCharsets.UTF_8));

            // 4. 构建并执行 pdflatex 命令
            ProcessBuilder pb = new ProcessBuilder("pdflatex", "-interaction=nonstopmode", texFile.toAbsolutePath().toString());
            pb.directory(tempDir.toFile()); // 设置工作目录
            pb.redirectErrorStream(true); // 合并标准错误和标准输出

            Process process = pb.start();

            StringBuilder log = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    log.append(line).append("\n");
                }
            }
            int exitCode = process.waitFor();

            // 读取进程输出（用于调试）
            System.out.println("pdflatex output:\n" + log.toString());

            // 5. 检查 pdflatex 是否成功
            if (exitCode != 0) {
                throw new RuntimeException("LaTeX compile error:\n" + log.toString());
            }

            // 6. 读取生成的 .pdf 文件
            if (!Files.exists(pdfFile)) {
                throw new RuntimeException("PDF not generated. Log:\n" + log.toString());
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