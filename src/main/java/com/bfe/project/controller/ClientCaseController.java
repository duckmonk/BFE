package com.bfe.project.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bfe.project.controller.Task.TaskCenterController;
import com.bfe.project.entity.ClientCase;
import com.bfe.project.entity.User;
import com.bfe.project.service.ClientCaseService;
import com.bfe.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import com.bfe.project.service.LaTeXService;
import com.bfe.project.service.PdfMergeService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.stream.Collectors;
import java.io.IOException;

@RestController
@RequestMapping("/client-case")
public class ClientCaseController {

    private static final Logger log = LoggerFactory.getLogger(ClientCaseController.class);

    @Autowired
    private ClientCaseService clientCaseService;

    @Autowired
    private TaskCenterController taskCenterController;
    
    @Autowired
    private UserService userService;

    @Autowired
    private LaTeXService latexService;

    @Autowired
    private PdfMergeService pdfMergeService;

    @GetMapping("/{id}")
    public Map<String, Object> getByCaseId(@PathVariable Integer id) {
        // 查询用户最新的case
        ClientCase existingCase = clientCaseService.lambdaQuery()
                .eq(ClientCase::getId, id)
                .one();
                
        Map<String, Object> result = new HashMap<>();
        if (existingCase != null) {
            result.put("status", "success");
            result.putAll(existingCase.toMap());
            result.put("tasksStatus", taskCenterController.getTasksStatus(existingCase.getId()));
            return result;
        }
        return null;
    }

    @GetMapping("/current")
    public Map<String, Object> getCurrentCase() {
        // 获取当前登录用户ID
        Integer userId = StpUtil.getLoginIdAsInt();
        
        // 查询用户最新的case
        ClientCase existingCase = clientCaseService.lambdaQuery()
                .eq(ClientCase::getUserId, userId)
                .orderByDesc(ClientCase::getId)
                .last("LIMIT 1")
                .one();
                
        Map<String, Object> result = new HashMap<>();
        if (existingCase != null) {
            result.put("status", "success");
            result.putAll(existingCase.toMap());
            result.put("tasksStatus", taskCenterController.getTasksStatus(existingCase.getId()));
            return result;
        }
        
        result.put("status", "not_found");
        return result;
    }

    @PostMapping("/create")
    public Map<String, Object> createCase() {
        // 获取当前登录用户ID
        Integer userId = StpUtil.getLoginIdAsInt();
        
        // 创建新的case
        ClientCase newCase = new ClientCase();
        newCase.setUserId(userId);
        newCase.setCreateTimestamp(System.currentTimeMillis() / 1000);
        clientCaseService.save(newCase);
        
        Map<String, Object> result = new HashMap<>();
        result.put("status", "success");
        result.put("clientCaseId", newCase.getId());
        result.put("userId", newCase.getUserId());
        result.put("basicInfoFinished", newCase.getBasicInfoFinished());
        result.put("spouseInfoFinished", newCase.getSpouseInfoFinished());
        result.put("childrenInfoFinished", newCase.getChildrenInfoFinished());
        result.put("academicHistoryFinished", newCase.getAcademicHistoryFinished());
        result.put("employmentHistoryFinished", newCase.getEmploymentHistoryFinished());
        result.put("recommenderFinished", newCase.getRecommenderFinished());
        result.put("resumeFinished", newCase.getResumeFinished());
        result.put("niwPetitionFinished", newCase.getNiwPetitionFinished());
        result.put("tasksStatus", taskCenterController.getTasksStatus(newCase.getId()));
        return result;
    }

    @GetMapping("/list")
    public List<ClientCase> list() {
        return clientCaseService.list();
    }

    @GetMapping("/page")
    public Page<Map<String, Object>> page(@RequestParam(defaultValue = "1") Integer current,
                                        @RequestParam(defaultValue = "10") Integer size,
                                        @RequestParam(required = false) Long dateStart,
                                        @RequestParam(required = false) Long dateEnd) {
        // 获取基础分页数据
        Page<ClientCase> casePage = clientCaseService.lambdaQuery()
                .ge(dateStart != null, ClientCase::getCreateTimestamp, dateStart)
                .le(dateEnd != null, ClientCase::getCreateTimestamp, dateEnd)
                .page(new Page<>(current, size));
        
        // 转换为包含用户信息和任务状态的Map
        Page<Map<String, Object>> resultPage = new Page<>(current, size, casePage.getTotal());
        List<Map<String, Object>> records = casePage.getRecords().stream().map(clientCase -> {
            Map<String, Object> record = new HashMap<>();
            // 基础信息
            record.put("id", clientCase.getId());
            record.put("createTimestamp", clientCase.getCreateTimestamp());
            
            // 用户信息
            User user = userService.getById(clientCase.getUserId());
            if (user != null) {
                record.put("userName", user.getName());
                record.put("userEmail", user.getEmail());
            }
            
            // 任务状态
            Map<String, Boolean> tasksStatus = taskCenterController.getTasksStatus(clientCase.getId());
            record.putAll(tasksStatus);
            
            return record;
        }).collect(Collectors.toList());
        
        resultPage.setRecords(records);
        return resultPage;
    }

    @PostMapping("/save")
    public boolean save(@RequestBody ClientCase clientCase) {
        if (clientCase.getId() == null) {
            clientCase.setCreateTimestamp(System.currentTimeMillis() / 1000);
        }
        return clientCaseService.save(clientCase);
    }

    @PutMapping("/update")
    public boolean update(@RequestBody ClientCase clientCase) {
        return clientCaseService.updateById(clientCase);
    }

    @GetMapping("/user/{userId}")
    public Map<String, Object> getCaseIdByUserId(@PathVariable Integer userId) {
        // 查询用户最新的case
        ClientCase existingCase = clientCaseService.lambdaQuery()
                .eq(ClientCase::getUserId, userId)
                .orderByDesc(ClientCase::getId)
                .last("LIMIT 1")
                .one();
                
        Map<String, Object> result = new HashMap<>();
        if (existingCase != null) {
            result.put("status", "success");
            result.put("caseId", existingCase.getId());
            return result;
        }
        
        result.put("status", "not_found");
        return result;
    }

    @PostMapping("/save-and-preview-latex")
    public ResponseEntity<byte[]> saveAndPreviewLatex(@RequestParam Integer caseId, @RequestBody String latexContent) {
        try {
            // 1. 根据 caseId 查找 ClientCase 实体
            ClientCase clientCase = clientCaseService.getById(caseId);
            if (clientCase == null) {
                return ResponseEntity.badRequest().body(("Case with ID " + caseId + " not found.").getBytes());
            }

            // 2. 保存 LaTeX 内容到 pl_formatting 字段
            clientCase.setPlFormatting(latexContent);
            clientCaseService.updateById(clientCase);

            // 3. 调用 LaTeXService 生成 PDF
            byte[] pdfBytes = latexService.convertLatexToPdf(latexContent);

            // 4. 返回 PDF 内容
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header("Content-Disposition", "attachment; filename=\"document.pdf\"")
                .body(pdfBytes);

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(("Server error during save and preview: " + e.getMessage()).getBytes());
        }
    }

    @PostMapping("/{caseId}/combined-pdf")
    public ResponseEntity<byte[]> getCombinedPdf(
            @PathVariable Long caseId,
            @RequestParam("immigrationForms") MultipartFile immigrationForms) {
        try {
            ClientCase clientCase = clientCaseService.getById(caseId);
            if (clientCase == null) {
                return ResponseEntity.notFound().build();
            }

            // 获取PL Formatting内容
            String plFormatting = clientCase.getPlFormatting();
            if (plFormatting == null || plFormatting.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            // 将上传的PDF文件转换为字节数组
            byte[] immigrationFormsBytes = immigrationForms.getBytes();

            // 合并PDF
            byte[] combinedPdf = pdfMergeService.mergePdfs(plFormatting, immigrationFormsBytes);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(combinedPdf);
        } catch (Exception e) {
            log.error("Error combining PDFs", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 