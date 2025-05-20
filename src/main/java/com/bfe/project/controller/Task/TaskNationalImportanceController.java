package com.bfe.project.controller.Task;

import com.bfe.project.entity.Task.TaskNationalImportance;
import com.bfe.project.service.Task.TaskNationalImportanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/task/national-importance")
public class TaskNationalImportanceController {

    @Autowired
    private TaskNationalImportanceService nationalImportanceService;

    @GetMapping("/case/{caseId}")
    public Map<String, Object> getNationalImportance(@PathVariable("caseId") Integer caseId) {
        Map<String, Object> result = new HashMap<>();
        
        TaskNationalImportance nationalImportance = nationalImportanceService.lambdaQuery()
                .eq(TaskNationalImportance::getClientCaseId, caseId)
                .one();
                
        if (nationalImportance != null) {
            result.put("id", nationalImportance.getId());
            result.put("clientCaseId", nationalImportance.getClientCaseId());
            result.put("prong1NiDraft", nationalImportance.getProng1NiDraft());
            result.put("prong1NiOverall", nationalImportance.getProng1NiOverall());
            result.put("prong1NiConfirmation", nationalImportance.getProng1NiConfirmation());
        }
        
        return result;
    }

    @PostMapping("/upsert")
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> submitNationalImportance(@RequestBody Map<String, Object> data) {
        TaskNationalImportance nationalImportance = new TaskNationalImportance();
        
        // 设置ID（如果存在）
        if (data.get("id") != null) {
            nationalImportance.setId((Integer) data.get("id"));
        }
        
        // 设置其他字段
        nationalImportance.setClientCaseId((Integer) data.get("clientCaseId"));
        nationalImportance.setProng1NiDraft((String) data.get("prong1NiDraft"));
        nationalImportance.setProng1NiOverall((String) data.get("prong1NiOverall"));
        nationalImportance.setProng1NiConfirmation((String) data.get("prong1NiConfirmation"));
        
        // 保存或更新
        nationalImportanceService.saveOrUpdate(nationalImportance);
        
        // 返回更新后的数据
        return getNationalImportance(nationalImportance.getClientCaseId());
    }
} 