package com.bfe.project.controller.InfoColl;

import com.bfe.project.entity.InfoColl.InfoCollFinalQuestionnaire;
import com.bfe.project.service.InfoColl.InfoCollFinalQuestionnaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/info-coll/final-questionnaire")
public class InfoCollFinalQuestionnaireController {

    @Autowired
    private InfoCollFinalQuestionnaireService finalQuestionnaireService;
    
    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/case/{caseId}")
    public Map<String, Object> getFinalQuestionnaire(@PathVariable("caseId") Integer caseId) throws JsonProcessingException {
        Map<String, Object> result = new HashMap<>();
        
        InfoCollFinalQuestionnaire questionnaire = finalQuestionnaireService.lambdaQuery()
                .eq(InfoCollFinalQuestionnaire::getClientCaseId, caseId)
                .one();
                
        if (questionnaire != null) {
            result.put("id", questionnaire.getId());
            result.put("clientCaseId", questionnaire.getClientCaseId());
            result.put("respondents", questionnaire.getRespondents());
            
            // 将JSON字符串转换为数组
            String changesSelected = questionnaire.getChangesSelected();
            if (changesSelected != null && !changesSelected.isEmpty()) {
                try {
                    List<String> changesSelectedList = objectMapper.readValue(changesSelected, List.class);
                    result.put("changesSelected", changesSelectedList);
                } catch (JsonProcessingException e) {
                    result.put("changesSelected", changesSelected);
                }
            } else {
                result.put("changesSelected", null);
            }
            
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
        }
        
        return result;
    }

    @PostMapping("/upsert")
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> submitFinalQuestionnaire(@RequestBody Map<String, Object> data) throws JsonProcessingException {
        InfoCollFinalQuestionnaire questionnaire = new InfoCollFinalQuestionnaire();
        
        // 设置ID（如果存在）
        if (data.get("id") != null) {
            questionnaire.setId((Integer) data.get("id"));
        }
        
        // 设置其他字段
        questionnaire.setClientCaseId((Integer) data.get("clientCaseId"));
        questionnaire.setRespondents((String) data.get("respondents"));
        
        // 处理changesSelected数组
        Object changesSelectedObj = data.get("changesSelected");
        if (changesSelectedObj instanceof List) {
            questionnaire.setChangesSelected(objectMapper.writeValueAsString(changesSelectedObj));
        } else {
            questionnaire.setChangesSelected((String) changesSelectedObj);
        }
        
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
        
        // 保存或更新
        finalQuestionnaireService.saveOrUpdate(questionnaire);
        
        // 返回更新后的数据
        return getFinalQuestionnaire(questionnaire.getClientCaseId());
    }
} 