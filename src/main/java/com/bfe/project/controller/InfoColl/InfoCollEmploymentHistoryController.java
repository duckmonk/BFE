package com.bfe.project.controller.InfoColl;

import com.bfe.project.entity.InfoColl.InfoCollEmploymentHistory;
import com.bfe.project.service.InfoColl.InfoCollEmploymentHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/info-coll/employment-history")
public class InfoCollEmploymentHistoryController {

    @Autowired
    private InfoCollEmploymentHistoryService infoCollEmploymentHistoryService;

    @PostMapping("/save-or-update")
    public Map<String, Object> saveOrUpdate(@RequestBody List<InfoCollEmploymentHistory> employmentHistoryList) {
        Map<String, Object> result = new HashMap<>();
        
        if (employmentHistoryList != null && !employmentHistoryList.isEmpty()) {
            // 获取第一个元素的clientCaseId（假设所有元素都有相同的clientCaseId）
            Integer clientCaseId = employmentHistoryList.get(0).getClientCaseId();
            
            // 删除该case下的所有employment history记录
            infoCollEmploymentHistoryService.lambdaUpdate()
                    .eq(InfoCollEmploymentHistory::getClientCaseId, clientCaseId)
                    .remove();
            
            // 批量保存新的employment history记录
            infoCollEmploymentHistoryService.saveBatch(employmentHistoryList);
            result.put("status", "updated");
        } else {
            result.put("status", "no_data");
        }
        
        result.put("data", employmentHistoryList);
        return result;
    }

    @GetMapping("/case/{clientCaseId}")
    public ResponseEntity<List<InfoCollEmploymentHistory>> getByClientCaseId(@PathVariable Integer clientCaseId) {
        try {
            List<InfoCollEmploymentHistory> employmentHistoryList = infoCollEmploymentHistoryService.lambdaQuery()
                    .eq(InfoCollEmploymentHistory::getClientCaseId, clientCaseId)
                    .orderByAsc(InfoCollEmploymentHistory::getId)
                    .list();
            return ResponseEntity.ok(employmentHistoryList);
        } catch (Exception e) {
            return ResponseEntity.ok(null);
        }
    }
} 