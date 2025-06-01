package com.bfe.project.controller.InfoColl;

import com.bfe.project.entity.InfoColl.InfoCollEmploymentHistory;
import com.bfe.project.service.InfoColl.InfoCollEmploymentHistoryService;
import com.bfe.project.entity.ClientCase;
import com.bfe.project.service.ClientCaseService;
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

    @Autowired
    private ClientCaseService clientCaseService;

    @PostMapping("/upsert/{clientCaseId}")
    public Map<String, Object> saveOrUpdate(@PathVariable Integer clientCaseId, @RequestBody List<InfoCollEmploymentHistory> employmentHistoryList) {
        Map<String, Object> result = new HashMap<>();
            
            // 删除该case下的所有employment history记录
            infoCollEmploymentHistoryService.lambdaUpdate()
                    .eq(InfoCollEmploymentHistory::getClientCaseId, clientCaseId)
                    .remove();
            
        // 如果有新数据，则保存
        if (employmentHistoryList != null && !employmentHistoryList.isEmpty()) {
            // 确保所有记录都有正确的 clientCaseId
            employmentHistoryList.forEach(history -> history.setClientCaseId(clientCaseId));
            infoCollEmploymentHistoryService.saveBatch(employmentHistoryList);
            result.put("status", "updated");
            
            // 更新 ClientCase 的完成状态
            clientCaseService.lambdaUpdate()
                    .eq(ClientCase::getId, clientCaseId)
                    .set(ClientCase::getEmploymentHistoryFinished, true)
                    .update();
        } else {
            result.put("status", "deleted");
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