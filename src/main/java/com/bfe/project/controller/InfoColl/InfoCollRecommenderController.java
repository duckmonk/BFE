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

@RestController
@RequestMapping("/info-coll/recommender")
public class InfoCollRecommenderController {

    @Autowired
    private InfoCollRecommenderService recommenderService;
    
    @Autowired
    private ObjectMapper objectMapper;

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

    @PostMapping("/submit")
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> submitRecommenders(@RequestBody Map<String, Object> data) throws JsonProcessingException {
        Integer clientCaseId = (Integer) data.get("clientCaseId");
        List<Map<String, Object>> recommenders = (List<Map<String, Object>>) data.get("recommenders");
        
        // 删除旧的推荐人数据
        recommenderService.lambdaUpdate()
                .eq(InfoCollRecommender::getClientCaseId, clientCaseId)
                .remove();
        
        // 插入新的推荐人数据
        if (recommenders != null) {
            for (Map<String, Object> recommenderData : recommenders) {
                InfoCollRecommender recommender = new InfoCollRecommender();
                recommender.setId((Integer) recommenderData.get("id"));
                recommender.setClientCaseId(clientCaseId);
                recommender.setName((String) recommenderData.get("name"));
                recommender.setResume((String) recommenderData.get("resume"));
                recommender.setType((String) recommenderData.get("type"));
                recommender.setCode((String) recommenderData.get("code"));
                recommender.setPronoun((String) recommenderData.get("pronoun"));
                recommender.setNote((String) recommenderData.get("note"));
                
                // 设置日期字段
                recommender.setMeetDate((String) recommenderData.get("meetDate"));
                
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
                
                Object evalAspectsObj = recommenderData.get("evalAspects");
                if (evalAspectsObj instanceof List) {
                    recommender.setEvalAspects(objectMapper.writeValueAsString(evalAspectsObj));
                } else {
                    recommender.setEvalAspects((String) evalAspectsObj);
                }
                
                recommender.setEvalAspectsOther((String) recommenderData.get("evalAspectsOther"));
                recommender.setIndependentEval((String) recommenderData.get("independentEval"));
                
                Object characteristicsObj = recommenderData.get("characteristics");
                if (characteristicsObj instanceof List) {
                    recommender.setCharacteristics(objectMapper.writeValueAsString(characteristicsObj));
                } else {
                    recommender.setCharacteristics((String) characteristicsObj);
                }
                
                recommender.setRelationshipStory((String) recommenderData.get("relationshipStory"));
                
                recommenderService.save(recommender);
            }
        }
        
        // 返回更新后的推荐人列表
        return getRecommenders(clientCaseId);
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