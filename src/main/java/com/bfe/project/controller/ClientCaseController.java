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
import com.bfe.project.entity.Inquiry;
import com.bfe.project.service.InquiryService;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.IOException;
import java.util.stream.Collectors;
import java.util.*;
import com.bfe.project.entity.InfoColl.InfoCollBasicInfo;
import com.bfe.project.service.InfoColl.InfoCollBasicInfoService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

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

    @Autowired
    private InquiryService inquiryService;

    @Autowired
    private InfoCollBasicInfoService infoCollBasicInfoService;

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
            // 查询该用户最新的 Inquiry
            Inquiry latestInquiry = inquiryService.lambdaQuery()
                .eq(Inquiry::getUserId, userId)
                .orderByDesc(Inquiry::getCreateTimestamp)
                .last("LIMIT 1")
                .one();

            // 如果 inquiry 存在且 caseStatusBfeInq 为 CLOSED，则视为 not_found
            if (latestInquiry != null && "CLOSED".equalsIgnoreCase(latestInquiry.getCaseStatusBfeInq())) {
                result.put("status", "not_found");
                return result;
            }

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

        // 读取 seed.tex 内容
        String seedLatex = "";
        try {
            seedLatex = new String(Files.readAllBytes(Paths.get("./resources/latex/seed.tex")));
            System.out.println("seedLatex");
            System.out.println(seedLatex);
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("seedLatex error");
            System.out.println(e.getMessage());
        }

        // 创建新的case
        ClientCase newCase = new ClientCase();
        newCase.setUserId(userId);
        newCase.setCreateTimestamp(System.currentTimeMillis() / 1000);
        newCase.setPlFormatting(seedLatex); // 设置初始latex内容
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

    @PostMapping(value = "/save-and-preview-latex", consumes = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<byte[]> saveAndPreviewLatex(
            @RequestParam Integer caseId,
            @RequestParam String typeOfPetition,
            @RequestBody String latexContent) throws JsonProcessingException {
        try {
            // 1. 查找 ClientCase
            ClientCase clientCase = clientCaseService.getById(caseId);
            if (clientCase == null) {
                Map<String, Object> errorBody = new HashMap<>();
                errorBody.put("status", "error");
                errorBody.put("message", "Case with ID " + caseId + " not found.");
                return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new ObjectMapper().writeValueAsBytes(errorBody));
            }

            // 2. 获取basic info中的full name
            InfoCollBasicInfo basicInfo = infoCollBasicInfoService.lambdaQuery()
                    .eq(InfoCollBasicInfo::getClientCaseId, caseId)
                    .one();
            if (basicInfo == null || basicInfo.getFullName() == null || basicInfo.getFullName().trim().isEmpty()) {
                Map<String, Object> errorBody = new HashMap<>();
                errorBody.put("status", "error");
                errorBody.put("message", "Basic info not found or full name is empty.");
                return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new ObjectMapper().writeValueAsBytes(errorBody));
            }

            // 3. 获取律师信息
            Inquiry inquiry = inquiryService.lambdaQuery()
                    .eq(Inquiry::getUserId, clientCase.getUserId())
                    .orderByDesc(Inquiry::getCreateTimestamp)
                    .last("LIMIT 1")
                    .one();
            if (inquiry == null || inquiry.getBfeSendOutAttorneyInq() == null) {
                Map<String, Object> errorBody = new HashMap<>();
                errorBody.put("status", "error");
                errorBody.put("message", "Attorney info not found.");
                return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new ObjectMapper().writeValueAsBytes(errorBody));
            }

            User attorney = userService.getById(inquiry.getBfeSendOutAttorneyInq());
            if (attorney == null) {
                Map<String, Object> errorBody = new HashMap<>();
                errorBody.put("status", "error");
                errorBody.put("message", "Attorney not found.");
                return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new ObjectMapper().writeValueAsBytes(errorBody));
            }

            String clsContent = new String(Files.readAllBytes(Paths.get("./resources/latex/pl_template.cls")));
            clsContent = clsContent.replace("REPLACE-PETITIONER-NAME", basicInfo.getFullName());
            clsContent = clsContent.replace("REPLACE-TYPE-OF-PETITION", typeOfPetition);
            clsContent = clsContent.replace("REPLACE-HE-SHE-LOW", basicInfo.getGender().equals("Male") ? "He" : "She");
            clsContent = clsContent.replace("REPLACE-HE-SHE-UP", basicInfo.getGender().equals("Male") ? "He" : "She");
            clsContent = clsContent.replace("REPLACE-HIS-HER-LOW", basicInfo.getGender().equals("Male") ? "His" : "Her");
            clsContent = clsContent.replace("REPLACE-MR-MS", basicInfo.getGender().equals("Male") ? "Mr." : "Ms.");
            clsContent = clsContent.replace("REPLACE-ATTORNEY-NAME", attorney.getName());
            clsContent = clsContent.replace("REPLACE-ATTORNEY-EMAIL", attorney.getEmail());
            clsContent = clsContent.replace("REPLACE-LAW-FIRM-NAME", attorney.getFirmName());

            // 设置律所地址信息
            String firmAddress = "";
            String firmPhone = "";
            String firmEmail = "";
            String firmWebsite = "";

            if ("Besting Law, APC".equals(attorney.getFirmName())) {
                firmAddress = "1625 The Alam da, Suite 202, San Jose, CA 95126";
                firmPhone = "(408)-763-4949";
                firmEmail = "info@bestinglaw.com";
                firmWebsite = "bestinglaw.com";
            } else if ("YC LAW GROUP, PC".equals(attorney.getFirmName())) {
                firmAddress = "2880 Zanker Road, #203, San Jose, CA 95134";
                firmPhone = "(408) 614-7199";
                firmEmail = "info@yclawgroup.com";
                firmWebsite = "yclawgroup.com";
            } else {
                firmAddress = "mock address";
                firmPhone = "mock phone";
                firmEmail = "mock email";
                firmWebsite = "mock website";
            }

            clsContent = clsContent.replace("REPLACE-LAW-FIRM-ADDRESS", firmAddress);
            clsContent = clsContent.replace("REPLACE-LAW-FIRM-PHONE", firmPhone);
            clsContent = clsContent.replace("REPLACE-LAW-FIRM-EMAIL", firmEmail);
            clsContent = clsContent.replace("REPLACE-LAW-FIRM-WEBSITE", firmWebsite);

            // 保存
            clientCase.setPlFormattingCls(clsContent);
            clientCase.setTypeOfPetition(typeOfPetition);
            // 如果 latexContent 为空，则使用 seed.tex 内容
            if (latexContent == null || latexContent.trim().isEmpty()) {
                latexContent = new String(Files.readAllBytes(Paths.get("./resources/latex/seed.tex")));
            }
            clientCase.setPlFormatting(latexContent);
            clientCaseService.updateById(clientCase);

            // 生成 PDF
            byte[] pdfBytes = latexService.convertLatexToPdf(latexContent, clsContent);

            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header("Content-Disposition", "attachment; filename=\"document.pdf\"")
                .body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace();
            String errorMessage = e.getMessage();
            if (errorMessage == null || errorMessage.trim().isEmpty()) {
                errorMessage = "An unexpected error occurred during PDF generation.";
            }
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put("status", "error");
            errorBody.put("message", errorMessage);
            System.out.println("errorBody");
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ObjectMapper().writeValueAsBytes(errorBody));
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

            // 直接用数据库中已保存的内容
            String latexContent = clientCase.getPlFormatting();
            String clsContent = clientCase.getPlFormattingCls();

            if (latexContent == null || latexContent.trim().isEmpty() ||
                clsContent == null || clsContent.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("PL Formatting or class file is empty.".getBytes());
            }

            // 生成主PDF
            byte[] mainPdf = latexService.convertLatexToPdf(latexContent, clsContent);

            // immigrationForms PDF
            byte[] immigrationFormsBytes = immigrationForms.getBytes();

            // 合并PDF，传入clsContent
            byte[] combinedPdf = pdfMergeService.mergePdfs(mainPdf, immigrationFormsBytes, clsContent);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header("Content-Disposition", "attachment; filename=\"combined.pdf\"")
                    .body(combinedPdf);
        } catch (Exception e) {
            log.error("Error combining PDFs", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 