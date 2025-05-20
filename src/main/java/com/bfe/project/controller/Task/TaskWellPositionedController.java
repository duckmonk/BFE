package com.bfe.project.controller.Task;

import com.bfe.project.entity.Task.TaskWellPositioned;
import com.bfe.project.service.Task.TaskWellPositionedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/task/well-positioned")
public class TaskWellPositionedController {

    @Autowired
    private TaskWellPositionedService wellPositionedService;

    @GetMapping("/case/{caseId}")
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> getWellPositioned(@PathVariable("caseId") Integer caseId) {
        // 获取良好定位任务信息
        TaskWellPositioned wellPositioned = wellPositionedService.lambdaQuery()
                .eq(TaskWellPositioned::getClientCaseId, caseId)
                .one();

        if (wellPositioned == null) {
            // 如果没有记录，创建新的
            wellPositioned = new TaskWellPositioned();
            wellPositioned.setClientCaseId(caseId);
            wellPositioned.setProng2WpDraft("");
            wellPositioned.setProng2WpOverall("");
            wellPositioned.setProng2WpConfirm("");
            wellPositionedService.save(wellPositioned);
        }

        // 返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("id", wellPositioned.getId());
        result.put("clientCaseId", wellPositioned.getClientCaseId());
        result.put("draft", wellPositioned.getProng2WpDraft());
        result.put("overall", wellPositioned.getProng2WpOverall());
        result.put("confirm", wellPositioned.getProng2WpConfirm());

        return result;
    }

    @PostMapping("/submit")
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> submitWellPositioned(@RequestBody Map<String, Object> data) {
        if (data == null) {
            return new HashMap<>();
        }

        Integer caseId = (Integer) data.get("clientCaseId");
        
        // 删除现有的记录
        wellPositionedService.lambdaUpdate()
                .eq(TaskWellPositioned::getClientCaseId, caseId)
                .remove();

        // 创建新记录
        TaskWellPositioned wellPositioned = new TaskWellPositioned();
        wellPositioned.setClientCaseId(caseId);
        wellPositioned.setProng2WpDraft((String) data.get("draft"));
        wellPositioned.setProng2WpOverall((String) data.get("overall"));
        wellPositioned.setProng2WpConfirm((String) data.get("confirm"));
        
        wellPositionedService.save(wellPositioned);

        // 返回更新后的数据
        return getWellPositioned(caseId);
    }
} 