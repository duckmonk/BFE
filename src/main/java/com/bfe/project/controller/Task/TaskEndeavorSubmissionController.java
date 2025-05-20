package com.bfe.project.controller.Task;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.bfe.project.entity.Task.TaskEndeavorSubmission;
import com.bfe.project.service.Task.TaskEndeavorSubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/task/endeavor-submission")
public class TaskEndeavorSubmissionController {

    @Autowired
    private TaskEndeavorSubmissionService taskEndeavorSubmissionService;

    @PostMapping("/upsert")
    public Map<String, Object> saveOrUpdate(@RequestBody TaskEndeavorSubmission submission) {
        Map<String, Object> result = new HashMap<>();
        
        // 根据clientCaseId查询是否存在记录
        TaskEndeavorSubmission existingSubmission = taskEndeavorSubmissionService.lambdaQuery()
                .eq(TaskEndeavorSubmission::getClientCaseId, submission.getClientCaseId())
                .one();
                
        if (existingSubmission != null) {
            // 如果存在，设置ID进行更新
            submission.setId(existingSubmission.getId());
            taskEndeavorSubmissionService.updateById(submission);
            result.put("status", "updated");
        } else {
            // 如果不存在，进行插入
            taskEndeavorSubmissionService.save(submission);
            result.put("status", "inserted");
        }
        
        result.put("data", submission);
        return result;
    }

    @GetMapping("/case/{clientCaseId}")
    public ResponseEntity<TaskEndeavorSubmission> getByClientCaseId(@PathVariable Integer clientCaseId) {
        try {
            LambdaQueryWrapper<TaskEndeavorSubmission> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(TaskEndeavorSubmission::getClientCaseId, clientCaseId);
            TaskEndeavorSubmission submission = taskEndeavorSubmissionService.getOne(wrapper);
            return ResponseEntity.ok(submission);
        } catch (Exception e) {
            return ResponseEntity.ok(null);
        }
    }
} 