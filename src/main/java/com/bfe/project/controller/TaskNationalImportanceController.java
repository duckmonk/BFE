package com.bfe.project.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.bfe.project.entity.Task.TaskNationalImportance;
import com.bfe.project.service.Task.TaskNationalImportanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/task/national-importance")
public class TaskNationalImportanceController {

    @Autowired
    private TaskNationalImportanceService taskNationalImportanceService;

    @PostMapping("/save-or-update")
    public Map<String, Object> saveOrUpdate(@RequestBody TaskNationalImportance taskNationalImportance) {
        Map<String, Object> result = new HashMap<>();
        
        // 根据clientCaseId查询是否存在记录
        TaskNationalImportance existingTask = taskNationalImportanceService.lambdaQuery()
                .eq(TaskNationalImportance::getClientCaseId, taskNationalImportance.getClientCaseId())
                .one();
                
        if (existingTask != null) {
            // 如果存在，设置ID进行更新
            taskNationalImportance.setId(existingTask.getId());
            taskNationalImportanceService.updateById(taskNationalImportance);
            result.put("status", "updated");
        } else {
            // 如果不存在，进行插入
            taskNationalImportanceService.save(taskNationalImportance);
            result.put("status", "inserted");
        }
        
        result.put("data", taskNationalImportance);
        return result;
    }

    @GetMapping("/case/{clientCaseId}")
    public ResponseEntity<TaskNationalImportance> getByClientCaseId(@PathVariable Integer clientCaseId) {
        try {
            LambdaQueryWrapper<TaskNationalImportance> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(TaskNationalImportance::getClientCaseId, clientCaseId);
            TaskNationalImportance task = taskNationalImportanceService.getOne(wrapper);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.ok(null);
        }
    }
} 