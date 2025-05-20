package com.bfe.project.controller.Task;

import com.bfe.project.entity.Task.TaskFuturePlan;
import com.bfe.project.service.Task.TaskFuturePlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/task/future-plan")
public class TaskFuturePlanController {

    @Autowired
    private TaskFuturePlanService futurePlanService;
    
    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/case/{caseId}")
    public Map<String, Object> getFuturePlan(@PathVariable("caseId") Integer caseId) throws JsonProcessingException {
        Map<String, Object> result = new HashMap<>();
        
        TaskFuturePlan futurePlan = futurePlanService.lambdaQuery()
                .eq(TaskFuturePlan::getClientCaseId, caseId)
                .one();
                
        if (futurePlan != null) {
            result.put("id", futurePlan.getId());
            result.put("clientCaseId", futurePlan.getClientCaseId());
            result.put("futureplanDraft", futurePlan.getFutureplanDraft());
            result.put("futureplanShort", futurePlan.getFutureplanShort());
            result.put("futureplanLong", futurePlan.getFutureplanLong());
            
            // 将JSON字符串转换为List
            String referees = futurePlan.getFutureplanReferees();
            if (referees != null && !referees.isEmpty()) {
                try {
                    List<String> refereesList = objectMapper.readValue(referees, new TypeReference<List<String>>() {});
                    result.put("futureplanReferees", refereesList);
                } catch (JsonProcessingException e) {
                    result.put("futureplanReferees", referees);
                }
            } else {
                result.put("futureplanReferees", null);
            }
            
            result.put("futureplanFeedback", futurePlan.getFutureplanFeedback());
            result.put("futureplanSubmitDraft", futurePlan.getFutureplanSubmitDraft());
            result.put("futureplanConfirm", futurePlan.getFutureplanConfirm());
            
            // 将JSON字符串转换为Map
            String refereeNotes = futurePlan.getFutureplanRefereeNotes();
            if (refereeNotes != null && !refereeNotes.isEmpty()) {
                try {
                    Map<String, String> refereeNotesMap = objectMapper.readValue(refereeNotes, new TypeReference<Map<String, String>>() {});
                    result.put("futureplanRefereeNotes", refereeNotesMap);
                } catch (JsonProcessingException e) {
                    result.put("futureplanRefereeNotes", refereeNotes);
                }
            } else {
                result.put("futureplanRefereeNotes", null);
            }
        }
        
        return result;
    }

    @PostMapping("/upsert")
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> submitFuturePlan(@RequestBody Map<String, Object> data) throws JsonProcessingException {
        TaskFuturePlan futurePlan = new TaskFuturePlan();
        
        // 设置ID（如果存在）
        if (data.get("id") != null) {
            futurePlan.setId((Integer) data.get("id"));
        }
        
        // 设置其他字段
        futurePlan.setClientCaseId((Integer) data.get("clientCaseId"));
        futurePlan.setFutureplanDraft((String) data.get("futureplanDraft"));
        futurePlan.setFutureplanShort((String) data.get("futureplanShort"));
        futurePlan.setFutureplanLong((String) data.get("futureplanLong"));
        
        // 处理referees数组
        Object refereesObj = data.get("futureplanReferees");
        if (refereesObj != null) {
            if (refereesObj instanceof List) {
                futurePlan.setFutureplanReferees(objectMapper.writeValueAsString(refereesObj));
            } else if (refereesObj instanceof String) {
                futurePlan.setFutureplanReferees((String) refereesObj);
            } else {
                futurePlan.setFutureplanReferees(objectMapper.writeValueAsString(refereesObj));
            }
        }
        
        futurePlan.setFutureplanFeedback((String) data.get("futureplanFeedback"));
        futurePlan.setFutureplanSubmitDraft((String) data.get("futureplanSubmitDraft"));
        futurePlan.setFutureplanConfirm((String) data.get("futureplanConfirm"));
        
        // 处理refereeNotes对象
        Object refereeNotesObj = data.get("futureplanRefereeNotes");
        if (refereeNotesObj != null) {
            if (refereeNotesObj instanceof Map) {
                futurePlan.setFutureplanRefereeNotes(objectMapper.writeValueAsString(refereeNotesObj));
            } else if (refereeNotesObj instanceof String) {
                futurePlan.setFutureplanRefereeNotes((String) refereeNotesObj);
            } else {
                futurePlan.setFutureplanRefereeNotes(objectMapper.writeValueAsString(refereeNotesObj));
            }
        }
        
        // 保存或更新
        futurePlanService.saveOrUpdate(futurePlan);
        
        // 返回更新后的数据
        return getFuturePlan(futurePlan.getClientCaseId());
    }
} 