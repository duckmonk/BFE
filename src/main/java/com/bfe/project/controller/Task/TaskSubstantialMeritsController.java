package com.bfe.project.controller.Task;

import com.bfe.project.entity.Task.TaskSubstantialMerits;
import com.bfe.project.service.Task.TaskSubstantialMeritsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/task/substantial-merits")
public class TaskSubstantialMeritsController {

    @Autowired
    private TaskSubstantialMeritsService substantialMeritsService;

    @GetMapping("/case/{caseId}")
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> getSubstantialMerits(@PathVariable("caseId") Integer caseId) {
        // 获取实质性优点任务信息
        TaskSubstantialMerits substantialMerits = substantialMeritsService.lambdaQuery()
                .eq(TaskSubstantialMerits::getClientCaseId, caseId)
                .one();

        if (substantialMerits == null) {
            // 如果没有记录，创建新的
            substantialMerits = new TaskSubstantialMerits();
            substantialMerits.setClientCaseId(caseId);
            substantialMerits.setProng1SmDraft("");
            substantialMerits.setProng1SmOverall("");
            substantialMerits.setProng1SmConfirm("");
            substantialMeritsService.save(substantialMerits);
        }

        // 返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("id", substantialMerits.getId());
        result.put("clientCaseId", substantialMerits.getClientCaseId());
        result.put("draft", substantialMerits.getProng1SmDraft());
        result.put("overall", substantialMerits.getProng1SmOverall());
        result.put("confirm", substantialMerits.getProng1SmConfirm());

        return result;
    }

    @PostMapping("/submit")
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> submitSubstantialMerits(@RequestBody Map<String, Object> data) {
        if (data == null) {
            return new HashMap<>();
        }

        Integer caseId = (Integer) data.get("clientCaseId");
        
        // 删除现有的记录
        substantialMeritsService.lambdaUpdate()
                .eq(TaskSubstantialMerits::getClientCaseId, caseId)
                .remove();

        // 创建新记录
        TaskSubstantialMerits substantialMerits = new TaskSubstantialMerits();
        substantialMerits.setClientCaseId(caseId);
        substantialMerits.setProng1SmDraft((String) data.get("draft"));
        substantialMerits.setProng1SmOverall((String) data.get("overall"));
        substantialMerits.setProng1SmConfirm((String) data.get("confirm"));
        
        substantialMeritsService.save(substantialMerits);

        // 返回更新后的数据
        return getSubstantialMerits(caseId);
    }
} 