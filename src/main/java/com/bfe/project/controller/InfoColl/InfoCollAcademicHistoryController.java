package com.bfe.project.controller.InfoColl;

import com.bfe.project.entity.InfoColl.InfoCollAcademicHistory;
import com.bfe.project.service.InfoColl.InfoCollAcademicHistoryService;
import com.bfe.project.entity.ClientCase;
import com.bfe.project.service.ClientCaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/info-coll/academic-history")
public class InfoCollAcademicHistoryController {

    @Autowired
    private InfoCollAcademicHistoryService infoCollAcademicHistoryService;

    @Autowired
    private ClientCaseService clientCaseService;

    @PostMapping("/upsert/{clientCaseId}")
    public Map<String, Object> saveOrUpdate(@PathVariable Integer clientCaseId, @RequestBody List<InfoCollAcademicHistory> academicHistoryList) {
        Map<String, Object> result = new HashMap<>();
        
        // 删除该case下的所有academic history记录
        infoCollAcademicHistoryService.lambdaUpdate()
                .eq(InfoCollAcademicHistory::getClientCaseId, clientCaseId)
                .remove();
            
        // 如果有新数据，则保存
        if (academicHistoryList != null && !academicHistoryList.isEmpty()) {
            // 确保所有记录都有正确的 clientCaseId
            academicHistoryList.forEach(history -> history.setClientCaseId(clientCaseId));
            infoCollAcademicHistoryService.saveBatch(academicHistoryList);
            result.put("status", "updated");
            
            // 更新 ClientCase 的完成状态
            clientCaseService.lambdaUpdate()
                    .eq(ClientCase::getId, clientCaseId)
                    .set(ClientCase::getAcademicHistoryFinished, true)
                    .update();
        } else {
            result.put("status", "deleted");
        }
        
        result.put("data", academicHistoryList);
        return result;
    }

    @GetMapping("/case/{clientCaseId}")
    public ResponseEntity<List<InfoCollAcademicHistory>> getByClientCaseId(@PathVariable Integer clientCaseId) {
        try {
            List<InfoCollAcademicHistory> academicHistoryList = infoCollAcademicHistoryService.lambdaQuery()
                    .eq(InfoCollAcademicHistory::getClientCaseId, clientCaseId)
                    .orderByAsc(InfoCollAcademicHistory::getId)
                    .list();
            return ResponseEntity.ok(academicHistoryList);
        } catch (Exception e) {
            return ResponseEntity.ok(null);
        }
    }
} 