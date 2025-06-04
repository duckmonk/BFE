package com.bfe.project.controller.Task;

import com.bfe.project.entity.Task.TaskFinalQuestionnaire;
import com.bfe.project.service.Task.TaskFinalQuestionnaireService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/task/final-questionnaire")
public class TaskFinalQuestionnaireController {

    @Autowired
    private TaskFinalQuestionnaireService taskFinalQuestionnaireService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/case/{clientCaseId}")
    public ResponseEntity<Map<String, Object>> getByClientCaseId(@PathVariable Integer clientCaseId) {
        try {
            TaskFinalQuestionnaire questionnaire = taskFinalQuestionnaireService.lambdaQuery()
                    .eq(TaskFinalQuestionnaire::getClientCaseId, clientCaseId)
                    .one();
            
            Map<String, Object> result = new HashMap<>();
            if (questionnaire != null) {
                result.put("id", questionnaire.getId());
                result.put("clientCaseId", questionnaire.getClientCaseId());
                result.put("respondents", questionnaire.getRespondents());
                result.put("passportChanges", questionnaire.getPassportChanges());
                result.put("passportDocuments", questionnaire.getPassportDocuments());
                result.put("addressChanges", questionnaire.getAddressChanges());
                result.put("employerChanges", questionnaire.getEmployerChanges());
                result.put("i94Changes", questionnaire.getI94Changes());
                result.put("i94Documents", questionnaire.getI94Documents());
                result.put("marriageStatus", questionnaire.getMarriageStatus());
                result.put("spouseSubmission", questionnaire.getSpouseSubmission());
                result.put("childrenStatus", questionnaire.getChildrenStatus());
                result.put("childrenSubmission", questionnaire.getChildrenSubmission());
                result.put("immigrationUpdates", questionnaire.getImmigrationUpdates());
                result.put("immigrationDocuments", questionnaire.getImmigrationDocuments());
                
                // 将 JSON 字符串转换为字符串数组
                if (questionnaire.getChangesSelected() != null) {
                    try {
                        List<String> changesList = objectMapper.readValue(questionnaire.getChangesSelected(), List.class);
                        result.put("changesSelected", changesList);
                    } catch (Exception e) {
                        result.put("changesSelected", List.of());
                    }
                } else {
                    result.put("changesSelected", List.of());
                }
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.ok(new HashMap<>());
        }
    }

    @PostMapping("/upsert")
    public ResponseEntity<Map<String, Object>> upsert(@RequestBody Map<String, Object> data) {
        Map<String, Object> result = new HashMap<>();
        try {
            TaskFinalQuestionnaire questionnaire = new TaskFinalQuestionnaire();
            
            // 复制所有字段
            if (data.get("id") != null) {
                questionnaire.setId(Integer.valueOf(data.get("id").toString()));
            }
            questionnaire.setClientCaseId(Integer.valueOf(data.get("clientCaseId").toString()));
            questionnaire.setRespondents((String) data.get("respondents"));
            questionnaire.setPassportChanges((String) data.get("passportChanges"));
            questionnaire.setPassportDocuments((String) data.get("passportDocuments"));
            questionnaire.setAddressChanges((String) data.get("addressChanges"));
            questionnaire.setEmployerChanges((String) data.get("employerChanges"));
            questionnaire.setI94Changes((String) data.get("i94Changes"));
            questionnaire.setI94Documents((String) data.get("i94Documents"));
            questionnaire.setMarriageStatus((String) data.get("marriageStatus"));
            questionnaire.setSpouseSubmission((String) data.get("spouseSubmission"));
            questionnaire.setChildrenStatus((String) data.get("childrenStatus"));
            questionnaire.setChildrenSubmission((String) data.get("childrenSubmission"));
            questionnaire.setImmigrationUpdates((String) data.get("immigrationUpdates"));
            questionnaire.setImmigrationDocuments((String) data.get("immigrationDocuments"));
            questionnaire.setFinalQuestionnaireConfirm((String) data.get("finalQuestionnaireConfirm"));
            
            // 处理 changesSelected 数组
            if (data.get("changesSelected") != null) {
                questionnaire.setChangesSelected(objectMapper.writeValueAsString(data.get("changesSelected")));
            }
            
            if (questionnaire.getId() == null) {
                questionnaire.setCreateTimestamp(System.currentTimeMillis() / 1000);
            }
            questionnaire.setUpdateTimestamp(System.currentTimeMillis() / 1000);
            
            boolean success = taskFinalQuestionnaireService.saveOrUpdate(questionnaire);
            result.put("success", success);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.ok(result);
        }
    }
} 