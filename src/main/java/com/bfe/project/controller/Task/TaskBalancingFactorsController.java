package com.bfe.project.controller.Task;

import com.bfe.project.entity.Task.TaskBalancingFactors;
import com.bfe.project.service.Task.TaskBalancingFactorsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/task/balancing-factors")
public class TaskBalancingFactorsController {

    @Autowired
    private TaskBalancingFactorsService balancingFactorsService;

    @GetMapping("/case/{caseId}")
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> getBalancingFactors(@PathVariable("caseId") Integer caseId) {
        // 获取平衡因素任务信息
        TaskBalancingFactors balancingFactors = balancingFactorsService.lambdaQuery()
                .eq(TaskBalancingFactors::getClientCaseId, caseId)
                .one();

        if (balancingFactors == null) {
            // 如果没有记录，创建新的
            balancingFactors = new TaskBalancingFactors();
            balancingFactors.setClientCaseId(caseId);
            balancingFactors.setProng3BfDraft("");
            balancingFactors.setProng3BfOverall("");
            balancingFactors.setProng3BfConfirm("");
            balancingFactorsService.save(balancingFactors);
        }

        // 返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("id", balancingFactors.getId());
        result.put("clientCaseId", balancingFactors.getClientCaseId());
        result.put("prong3BfDraft", balancingFactors.getProng3BfDraft());
        result.put("prong3BfOverall", balancingFactors.getProng3BfOverall());
        result.put("prong3BfConfirm", balancingFactors.getProng3BfConfirm());

        return result;
    }

    @PostMapping("/submit")
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> submitBalancingFactors(@RequestBody Map<String, Object> data) {
        if (data == null) {
            return new HashMap<>();
        }

        Integer caseId = (Integer) data.get("clientCaseId");
        
        // 删除现有的记录
        balancingFactorsService.lambdaUpdate()
                .eq(TaskBalancingFactors::getClientCaseId, caseId)
                .remove();

        // 创建新记录
        TaskBalancingFactors balancingFactors = new TaskBalancingFactors();
        balancingFactors.setClientCaseId(caseId);
        balancingFactors.setProng3BfDraft((String) data.get("prong3BfDraft"));
        balancingFactors.setProng3BfOverall((String) data.get("prong3BfOverall"));
        balancingFactors.setProng3BfConfirm((String) data.get("prong3BfConfirm"));
        
        balancingFactorsService.save(balancingFactors);

        // 返回更新后的数据
        return getBalancingFactors(caseId);
    }
}