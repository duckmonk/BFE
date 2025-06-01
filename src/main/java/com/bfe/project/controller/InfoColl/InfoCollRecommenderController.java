package com.bfe.project.controller.InfoColl;

import com.bfe.project.entity.InfoColl.InfoCollRecommender;
import com.bfe.project.service.InfoColl.InfoCollRecommenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Date;
import com.bfe.project.entity.Task.TaskRecommendationLetter;
import com.bfe.project.service.Task.TaskRecommendationLetterService;
import com.bfe.project.entity.ClientCase;
import com.bfe.project.service.ClientCaseService;

@RestController
@RequestMapping("/info-coll/recommender")
public class InfoCollRecommenderController {

    @Autowired
    private InfoCollRecommenderService recommenderService;
    
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TaskRecommendationLetterService recommendationLetterService;

    @Autowired
    private ClientCaseService clientCaseService;

    @GetMapping("/case/{caseId}")
    public Map<String, Object> getRecommenders(@PathVariable("caseId") Integer caseId) throws JsonProcessingException {
        Map<String, Object> result = new HashMap<>();
        
        // 获取所有推荐人信息
        List<InfoCollRecommender> recommenders = recommenderService.lambdaQuery()
                .eq(InfoCollRecommender::getClientCaseId, caseId)
                .list();
                
        List<Map<String, Object>> recommenderList = new ArrayList<>();
        for (InfoCollRecommender recommender : recommenders) {
            Map<String, Object> recommenderMap = new HashMap<>();
            recommenderMap.put("id", recommender.getId());
            recommenderMap.put("clientCaseId", recommender.getClientCaseId());
            recommenderMap.put("name", recommender.getName());
            recommenderMap.put("resume", recommender.getResume());
            recommenderMap.put("type", recommender.getType());
            recommenderMap.put("code", recommender.getCode());
            recommenderMap.put("pronoun", recommender.getPronoun());
            recommenderMap.put("note", recommender.getNote());
            
            // 将JSON字符串转换为List
            String linkedContributions = recommender.getLinkedContributions();
            if (linkedContributions != null && !linkedContributions.isEmpty()) {
                try {
                    List<String> linkedContributionsList = objectMapper.readValue(linkedContributions, new TypeReference<List<String>>() {});
                    recommenderMap.put("linkedContributions", linkedContributionsList);
                } catch (JsonProcessingException e) {
                    recommenderMap.put("linkedContributions", linkedContributions);
                }
            } else {
                recommenderMap.put("linkedContributions", null);
            }
            
            recommenderMap.put("relationship", recommender.getRelationship());
            recommenderMap.put("relationshipOther", recommender.getRelationshipOther());
            recommenderMap.put("company", recommender.getCompany());
            recommenderMap.put("department", recommender.getDepartment());
            recommenderMap.put("title", recommender.getTitle());
            recommenderMap.put("meetDate", recommender.getMeetDate());
            
            // 将JSON字符串转换为List
            String evalAspects = recommender.getEvalAspects();
            if (evalAspects != null && !evalAspects.isEmpty()) {
                try {
                    List<String> evalAspectsList = objectMapper.readValue(evalAspects, new TypeReference<List<String>>() {});
                    recommenderMap.put("evalAspects", evalAspectsList);
                } catch (JsonProcessingException e) {
                    recommenderMap.put("evalAspects", evalAspects);
                }
            } else {
                recommenderMap.put("evalAspects", null);
            }
            
            recommenderMap.put("evalAspectsOther", recommender.getEvalAspectsOther());
            recommenderMap.put("independentEval", recommender.getIndependentEval());
            recommenderMap.put("characteristics", recommender.getCharacteristics());
            recommenderMap.put("relationshipStory", recommender.getRelationshipStory());
            recommenderList.add(recommenderMap);
        }
        
        result.put("recommenders", recommenderList);
        return result;
    }

    @PostMapping("/upsert")
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> saveOrUpdate(@RequestBody Map<String, Object> request) throws JsonProcessingException {
        Map<String, Object> response = new HashMap<>();
        Integer clientCaseId = (Integer) request.get("clientCaseId");
        
        if (clientCaseId == null) {
            response.put("status", "error");
            response.put("message", "clientCaseId is required");
            return response;
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> recommenders = (List<Map<String, Object>>) request.get("recommenders");
        
        // 1. 获取现有的推荐人信息
        List<InfoCollRecommender> existingRecommenders = recommenderService.lambdaQuery()
                .eq(InfoCollRecommender::getClientCaseId, clientCaseId)
                .list();
                
        // 2. 获取现有的推荐信任务
        List<TaskRecommendationLetter> existingLetters = recommendationLetterService.lambdaQuery()
                .eq(TaskRecommendationLetter::getClientCaseId, clientCaseId)
                .list();
        
        // 3. 按推荐人姓名分组现有推荐信
        Map<String, TaskRecommendationLetter> letterMap = existingLetters.stream()
                .collect(Collectors.toMap(
                    TaskRecommendationLetter::getRlRefereeName,
                    letter -> letter,
                    (existing, replacement) -> existing
                ));
                
        // 4. 按推荐人姓名分组现有推荐人
        Map<String, InfoCollRecommender> recommenderMap = existingRecommenders.stream()
                .collect(Collectors.toMap(
                    InfoCollRecommender::getName,
                    recommender -> recommender,
                    (existing, replacement) -> existing
                ));

        // 5. 处理推荐人信息和推荐信任务
        List<InfoCollRecommender> toSave = new ArrayList<>();
        Set<String> validRefereeNames = new HashSet<>();
        
        if (recommenders != null && !recommenders.isEmpty()) {
            for (Map<String, Object> recommenderData : recommenders) {
                String name = (String) recommenderData.get("name");
                validRefereeNames.add(name);
                
                InfoCollRecommender recommender = recommenderMap.get(name);
                if (recommender == null) {
                    recommender = new InfoCollRecommender();
                recommender.setClientCaseId(clientCaseId);
                }
                
                // 设置推荐人信息
                recommender.setName(name);
                recommender.setResume((String) recommenderData.get("resume"));
                recommender.setType((String) recommenderData.get("type"));
                recommender.setCode((String) recommenderData.get("code"));
                recommender.setPronoun((String) recommenderData.get("pronoun"));
                recommender.setNote((String) recommenderData.get("note"));
                
                // 处理数组字段
                Object linkedContributionsObj = recommenderData.get("linkedContributions");
                if (linkedContributionsObj instanceof List) {
                    recommender.setLinkedContributions(objectMapper.writeValueAsString(linkedContributionsObj));
                } else {
                    recommender.setLinkedContributions((String) linkedContributionsObj);
                }
                
                recommender.setRelationship((String) recommenderData.get("relationship"));
                recommender.setRelationshipOther((String) recommenderData.get("relationshipOther"));
                recommender.setCompany((String) recommenderData.get("company"));
                recommender.setDepartment((String) recommenderData.get("department"));
                recommender.setTitle((String) recommenderData.get("title"));
                
                // 处理日期字段
                Object meetDateObj = recommenderData.get("meetDate");
                if (meetDateObj instanceof Date) {
                    recommender.setMeetDate(objectMapper.writeValueAsString(meetDateObj));
                } else {
                    recommender.setMeetDate((String) meetDateObj);
                }
                
                // 处理数组字段
                Object evalAspectsObj = recommenderData.get("evalAspects");
                if (evalAspectsObj instanceof List) {
                    recommender.setEvalAspects(objectMapper.writeValueAsString(evalAspectsObj));
                } else {
                    recommender.setEvalAspects((String) evalAspectsObj);
                }
                
                recommender.setEvalAspectsOther((String) recommenderData.get("evalAspectsOther"));
                recommender.setIndependentEval((String) recommenderData.get("independentEval"));
                recommender.setCharacteristics((String) recommenderData.get("characteristics"));
                recommender.setRelationshipStory((String) recommenderData.get("relationshipStory"));
                
                toSave.add(recommender);
                
                // 创建或更新推荐信任务
                TaskRecommendationLetter letter = letterMap.get(name);
                if (letter == null) {
                    letter = new TaskRecommendationLetter();
                    letter.setClientCaseId(clientCaseId);
                    letter.setRlRefereeName(name);
                    letter.setRlDraft("");
                    letter.setRlOverallFeedback("");
                    letter.setRlConfirm("");
                    letter.setRlSignedLetter("");
                    recommendationLetterService.save(letter);
                }
            }
        }
        
        // 6. 删除不再需要的推荐人信息和推荐信任务
        List<InfoCollRecommender> toDelete = existingRecommenders.stream()
                .filter(r -> !validRefereeNames.contains(r.getName()))
                .collect(Collectors.toList());
                
        List<TaskRecommendationLetter> lettersToDelete = existingLetters.stream()
                .filter(letter -> !validRefereeNames.contains(letter.getRlRefereeName()))
                .collect(Collectors.toList());
        
        if (!toDelete.isEmpty()) {
            recommenderService.removeByIds(
                toDelete.stream()
                    .map(InfoCollRecommender::getId)
                    .collect(Collectors.toList())
            );
        }
        
        if (!lettersToDelete.isEmpty()) {
            recommendationLetterService.removeByIds(
                lettersToDelete.stream()
                    .map(TaskRecommendationLetter::getId)
                    .collect(Collectors.toList())
            );
        }
        
        // 7. 保存新的推荐人信息
        if (!toSave.isEmpty()) {
            recommenderService.saveOrUpdateBatch(toSave);
        }

        // 8. 更新 ClientCase 的完成状态
        clientCaseService.lambdaUpdate()
                .eq(ClientCase::getId, clientCaseId)
                .set(ClientCase::getRecommenderFinished, true)
                .update();
        
        response.put("status", "success");
        return response;
    }

    @GetMapping("/names/{caseId}")
    public Map<String, Object> getRecommenderNames(@PathVariable("caseId") Integer caseId) {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> recommenderNames = new ArrayList<>();
        
        List<InfoCollRecommender> recommenders = recommenderService.lambdaQuery()
                .eq(InfoCollRecommender::getClientCaseId, caseId)
                .list();
                
        for (InfoCollRecommender recommender : recommenders) {
            Map<String, Object> nameInfo = new HashMap<>();
            nameInfo.put("id", recommender.getId());
            nameInfo.put("name", recommender.getName());
            recommenderNames.add(nameInfo);
        }
        
        result.put("recommenders", recommenderNames);
        return result;
    }
} 