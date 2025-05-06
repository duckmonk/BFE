package com.bfe.project.controller.InfoColl;

import com.bfe.project.entity.InfoColl.InfoCollAcademicHistory;
import com.bfe.project.service.InfoColl.InfoCollAcademicHistoryService;
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

    @PostMapping("/save-or-update")
    public Map<String, Object> saveOrUpdate(@RequestBody List<InfoCollAcademicHistory> academicHistoryList) {
        Map<String, Object> result = new HashMap<>();
        
        if (academicHistoryList != null && !academicHistoryList.isEmpty()) {
            // 获取第一个元素的clientCaseId（假设所有元素都有相同的clientCaseId）
            Integer clientCaseId = academicHistoryList.get(0).getClientCaseId();
            
            // 删除该case下的所有academic history记录
            infoCollAcademicHistoryService.lambdaUpdate()
                    .eq(InfoCollAcademicHistory::getClientCaseId, clientCaseId)
                    .remove();
            
            // 批量保存新的academic history记录
            infoCollAcademicHistoryService.saveBatch(academicHistoryList);
            result.put("status", "updated");
        } else {
            result.put("status", "no_data");
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