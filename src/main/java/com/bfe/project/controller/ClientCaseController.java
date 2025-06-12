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
import com.bfe.project.entity.InfoColl.InfoCollAcademicHistory;
import com.bfe.project.service.InfoColl.InfoCollAcademicHistoryService;

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

    @Autowired
    private InfoCollAcademicHistoryService infoCollAcademicHistoryService;

    @GetMapping("/{id}")
    public Map<String, Object> getByCaseId(@PathVariable Integer id) {
        // 校验是否登录
        StpUtil.checkLogin();

        // 获取当前登录用户
        Integer userId = StpUtil.getLoginIdAsInt();
        User user = userService.getById(userId);
        if (user == null) {
            throw new RuntimeException("User not found.");
        }


        // 查询用户最新的case
        ClientCase existingCase = clientCaseService.lambdaQuery()
                .eq(ClientCase::getId, id)
                .one();
        
        if (existingCase == null) {
            throw new RuntimeException("Case not found.");
        }

        if (user.getUserType().equals("client")) {
            if (!existingCase.getUserId().equals(userId)) {
                throw new RuntimeException("Not authorized.");
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("status", "success");
        result.putAll(existingCase.toMap());
        
        // 将 exhibit list 从 JSON 字符串还原为数组
        if (existingCase.getExhibitList() != null && !existingCase.getExhibitList().trim().isEmpty()) {
            try {
                List<String> exhibitList = new ObjectMapper().readValue(existingCase.getExhibitList(), List.class);
                result.put("exhibitList", exhibitList);
            } catch (Exception e) {
                log.error("Failed to parse exhibit list JSON", e);
            }
        }
        
        result.put("tasksStatus", taskCenterController.getTasksStatus(existingCase.getId()));
        result.put("premiumProcess", existingCase.getPremiumProcess());
        result.put("mailingService", existingCase.getMailingService());
        result.put("beneficiaryWorkState", existingCase.getBeneficiaryWorkState());
        return result;
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
                result.put("caseStatusBfeInq", "CLOSED");
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

    @PostMapping(value = "/init-latex", consumes = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> initLatex(
            @RequestParam Integer caseId,
            @RequestParam String typeOfPetition,
            @RequestParam(required = false) String exhibitList,
            @RequestParam String premiumProcess,
            @RequestParam String mailingService,
            @RequestParam String beneficiaryWorkState
            ) throws JsonProcessingException {
        try {
            // 1. 查找 ClientCase
            ClientCase clientCase = clientCaseService.getById(caseId);
            if (clientCase == null) {
                Map<String, Object> errorBody = new HashMap<>();
                errorBody.put("status", "error");
                errorBody.put("message", "Case with ID " + caseId + " not found.");
                return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new ObjectMapper().writeValueAsString(errorBody));
            }

            // 2. 获取basic info中的full name
            InfoCollBasicInfo basicInfo = infoCollBasicInfoService.lambdaQuery()
                    .eq(InfoCollBasicInfo::getClientCaseId, caseId)
                    .one();
            if (basicInfo == null || basicInfo.getFullName() == null || basicInfo.getFullName().trim().isEmpty()) {
                Map<String, Object> errorBody = new HashMap<>();
                errorBody.put("status", "error");
                errorBody.put("message", "Basic info not found or full name is empty, please check 'Info Coll - Basic Info' section.");
                return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new ObjectMapper().writeValueAsString(errorBody));
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
                errorBody.put("message", "Attorney not selected, please check 'Inquiry Dashboard - View Details - Send Out Attorney' dropdown.");
                return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new ObjectMapper().writeValueAsString(errorBody));
            }

            User attorney = userService.getById(inquiry.getBfeSendOutAttorneyInq());
            if (attorney == null) {
                Map<String, Object> errorBody = new HashMap<>();
                errorBody.put("status", "error");
                errorBody.put("message", "Attorney not found, please select another attorney.");
                return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new ObjectMapper().writeValueAsString(errorBody));
            }

            String latexContent = new String(Files.readAllBytes(Paths.get("./resources/latex/seed.tex")));
            latexContent = latexContent.replace("REPLACE-PETITIONER-NAME", basicInfo.getFullName());
            latexContent = latexContent.replace("REPLACE-TYPE-OF-PETITION", typeOfPetition);
            latexContent = latexContent.replace("REPLACE-HE-SHE-LOW", basicInfo.getGender().equals("Male") ? "He" : "She");
            latexContent = latexContent.replace("REPLACE-HE-SHE-UP", basicInfo.getGender().equals("Male") ? "He" : "She");
            latexContent = latexContent.replace("REPLACE-HIS-HER-LOW", basicInfo.getGender().equals("Male") ? "His" : "Her");
            latexContent = latexContent.replace("REPLACE-MR-MS", basicInfo.getGender().equals("Male") ? "Mr" : "Ms");
            latexContent = latexContent.replace("REPLACE-ATTORNEY-NAME", attorney.getName());
            latexContent = latexContent.replace("REPLACE-ATTORNEY-EMAIL", attorney.getEmail());
            latexContent = latexContent.replace("REPLACE-LAW-FIRM-NAME", attorney.getFirmName());

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
                firmAddress = "MockAddress";
                firmPhone = "MockPhone";
                firmEmail = "MockEmail";
                firmWebsite = "MockWebsite";
            }

            latexContent = latexContent.replace("REPLACE-LAW-FIRM-ADDRESS", firmAddress);
            latexContent = latexContent.replace("REPLACE-LAW-FIRM-PHONE", firmPhone);
            latexContent = latexContent.replace("REPLACE-LAW-FIRM-EMAIL", firmEmail);
            latexContent = latexContent.replace("REPLACE-LAW-FIRM-WEBSITE", firmWebsite);

            // 生成学历LaTeX列表
            List<InfoCollAcademicHistory> academicList = infoCollAcademicHistoryService.lambdaQuery()
                .eq(InfoCollAcademicHistory::getClientCaseId, caseId)
                .orderByAsc(InfoCollAcademicHistory::getId)
                .list();
            StringBuilder educationListContent = new StringBuilder();
            if (!academicList.isEmpty()) {
                educationListContent.append("\\begin{itemize}\n");
                for (int i = 0; i < academicList.size(); i++) {
                    InfoCollAcademicHistory edu = academicList.get(i);
                    educationListContent.append("\\item \\textbf{")
                        .append(edu.getSchoolName() != null ? edu.getSchoolName() : "")
                        .append(":} ")
                        .append(edu.getDegree() != null ? edu.getDegree() : "");
                    if (edu.getMajor() != null && !edu.getMajor().isEmpty()) {
                        educationListContent.append(" with a major in ").append(edu.getMajor());
                    }
                    if (edu.getStatus() != null && !edu.getStatus().isEmpty()) {
                        educationListContent.append(" (").append(edu.getStatus()).append(")");
                    }
                    educationListContent.append(" (Exhibit ").append(i + 1).append(").");
                    educationListContent.append("\n");
                }
                educationListContent.append("\\end{itemize}\n");
            }
            latexContent = latexContent.replace("REPLACE-EDUCATION-LIST", educationListContent.toString());

            // 生成学历summary
            String[] numberWords = {"a", "two", "three", "four", "five"};
            StringBuilder summary = new StringBuilder();
            int n = academicList.size();
            if (n == 1) {
                InfoCollAcademicHistory edu = academicList.get(0);
                summary.append("a ")
                    .append(edu.getDegree() != null ? edu.getDegree() : "degree");
                if (edu.getMajor() != null && !edu.getMajor().isEmpty()) {
                    summary.append(" in ").append(edu.getMajor());
                }
                summary.append(" from ").append(edu.getSchoolName() != null ? edu.getSchoolName() : "");
                summary.append(" (Exhibit 1)");
            } else if (n > 1) {
                if (n <= 5) {
                    summary.append(numberWords[n - 1]);
                } else {
                    summary.append(n);
                }
                summary.append(" degrees: ");
                for (int i = 0; i < n; i++) {
                    InfoCollAcademicHistory edu = academicList.get(i);
                    summary.append("a ")
                        .append(edu.getDegree() != null ? edu.getDegree() : "degree");
                    if (edu.getMajor() != null && !edu.getMajor().isEmpty()) {
                        summary.append(" in ").append(edu.getMajor());
                    }
                    summary.append(" from ").append(edu.getSchoolName() != null ? edu.getSchoolName() : "");
                    summary.append(" (Exhibit ").append(i + 1).append(")");
                    if (i == n - 2) {
                        summary.append(" and ");
                    } else if (i < n - 2) {
                        summary.append(", ");
                    }
                }
            }
            latexContent = latexContent.replace("REPLACE-EDUCATION-SUMMARY", summary.toString());

            // 处理 Exhibit List
            StringBuilder exhibitListContent = new StringBuilder();
            if (exhibitList != null && !exhibitList.trim().isEmpty()) {
                List<String> exhibitListArray = new ObjectMapper().readValue(exhibitList, List.class);
                if (!exhibitListArray.isEmpty()) {
                    exhibitListContent.append("\\begin{itemize}\n");
                    for (int i = 0; i < exhibitListArray.size(); i++) {
                        exhibitListContent.append("\\item \\textbf{Exhibit ").append(i + 1).append("}: ").append(exhibitListArray.get(i)).append("\n");
                    }
                    exhibitListContent.append("\\end{itemize}\n");
                }
            }
            latexContent = latexContent.replace("REPLACE-EXHIBIT-LIST", exhibitListContent.toString());
            
            // 将 exhibit list 保存到数据库
            clientCase.setExhibitList(exhibitList);

            latexContent = latexContent.replace("REPLACE-MAILING-SERVICE", mailingService);
            // 生成REPLACE-RECEIVING-ADDRESS
            Set<String> westStates = new HashSet<>(Arrays.asList(
                "No U.S. employment", "Alaska", "Arizona", "Arkansas", "Armed Forces", "California", "Colorado", "Georgia", "Guam", "Hawaii", "Idaho", "Louisiana", "Marshall Islands", "Montana", "Nevada", "New Mexico", "Northern Mariana Islands", "Oklahoma", "Oregon", "Texas", "US Virgin Islands", "Utah", "Washington", "Wyoming"
            ));
            String receivingAddress;
            if (westStates.contains(beneficiaryWorkState)) {
                if ("U.S. Postal Service (USPS)".equals(mailingService)) {
                    receivingAddress = "USCIS\\\\\nAttn: Premium I-140\\\\\nP.O. Box 21500\\\\\nPhoenix, AZ 85036-1500";
                } else {
                    receivingAddress = "USCIS\\\\\nAttn: Premium I-140 (Box 21500)\\\\\n2108 E. Elliot Rd.\\\\\nTempe, AZ 85284-1806";
                }
            } else {
                if ("U.S. Postal Service (USPS)".equals(mailingService)) {
                    receivingAddress = "USCIS\\\\\nAttn: Premium I-140\\\\\nP.O. Box 4008\\\\\nCarol Stream, IL 60197-4008";
                } else {
                    receivingAddress = "USCIS\\\\\nAttn: Premium I-140 (Box 4008)\\\\\n2500 Westfield Drive\\\\\nElgin, IL 60124-7836";
                }
            }
            latexContent = latexContent.replace("REPLACE-RECEIVING-ADDRESS", receivingAddress);

            // 保存
            clientCase.setTypeOfPetition(typeOfPetition);
            clientCase.setPremiumProcess(premiumProcess);
            clientCase.setMailingService(mailingService);
            clientCase.setBeneficiaryWorkState(beneficiaryWorkState);
            // 如果 latexContent 为空，则使用 seed.tex 内容
            if (latexContent == null || latexContent.trim().isEmpty()) {
                latexContent = new String(Files.readAllBytes(Paths.get("./resources/latex/seed.tex")));
            }
            clientCase.setPlFormatting(latexContent);
            clientCaseService.updateById(clientCase);

            return ResponseEntity.ok()
                .contentType(MediaType.TEXT_PLAIN)
                .body(latexContent);
        } catch (Exception e) {
            e.printStackTrace();
            String errorMessage = e.getMessage();
            if (errorMessage == null || errorMessage.trim().isEmpty()) {
                errorMessage = "An unexpected error occurred during PDF generation.";
            }
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put("status", "error");
            errorBody.put("message", errorMessage);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ObjectMapper().writeValueAsString(errorBody));
        }
    }

    @PostMapping(value = "/save-and-preview-latex", consumes = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<byte[]> saveAndPreviewLatex(
            @RequestParam Integer caseId,
            @RequestBody String latexContent
            ) throws JsonProcessingException {
        try {
            // 1. 保存 latexContent 到数据库
            ClientCase clientCase = clientCaseService.getById(caseId);
            clientCase.setPlFormatting(latexContent);
            clientCaseService.updateById(clientCase);

            // 2. 生成 PDF
            String clsContent = new String(Files.readAllBytes(Paths.get("./resources/latex/pl_template.cls")));
            byte[] pdfBytes = latexService.convertLatexToPdf(latexContent, clsContent);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header("Content-Disposition", "attachment; filename=\"document.pdf\"")
                .body(pdfBytes);

        } catch (Exception e) {
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put("status", "error");
            errorBody.put("message", e.getMessage());
            try {
                return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new ObjectMapper().writeValueAsBytes(errorBody));
            } catch (Exception ex) {
                return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(("Failed to render PDF: " + e.getMessage()).getBytes());
            }
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
            String clsContent = new String(Files.readAllBytes(Paths.get("./resources/latex/pl_template.cls")));

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