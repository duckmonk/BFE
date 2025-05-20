package com.bfe.project.controller;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.scilab.forge.jlatexmath.TeXConstants;
import org.scilab.forge.jlatexmath.TeXFormula;
import org.scilab.forge.jlatexmath.TeXIcon;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/latex")
public class LaTeXController {

    @PostMapping("/render")
    public ResponseEntity<Map<String, byte[]>> renderLatex(@RequestBody String latexContent) {
        try {
            // 创建LaTeX公式
            TeXFormula formula = new TeXFormula(latexContent);
            
            // 设置渲染参数
            TeXIcon icon = formula.createTeXIcon(TeXConstants.STYLE_DISPLAY, 20);
            icon.setInsets(new Insets(5, 5, 5, 5));
            
            // 创建图片
            BufferedImage image = new BufferedImage(
                icon.getIconWidth(),
                icon.getIconHeight(),
                BufferedImage.TYPE_INT_ARGB
            );
            
            // 渲染到图片
            Graphics2D g2 = image.createGraphics();
            g2.setColor(Color.WHITE);
            g2.fillRect(0, 0, icon.getIconWidth(), icon.getIconHeight());
            icon.paintIcon(null, g2, 0, 0);
            
            // 转换为PNG
            ByteArrayOutputStream pngBaos = new ByteArrayOutputStream();
            ImageIO.write(image, "png", pngBaos);
            
            // 创建PDF
            ByteArrayOutputStream pdfBaos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(pdfBaos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            // 添加LaTeX公式到PDF
            document.add(new Paragraph(latexContent));
            document.close();
            
            // 准备返回数据
            Map<String, byte[]> result = new HashMap<>();
            result.put("png", pngBaos.toByteArray());
            result.put("pdf", pdfBaos.toByteArray());
            
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(result);
                
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", ("Error rendering LaTeX: " + e.getMessage()).getBytes()));
        }
    }
} 