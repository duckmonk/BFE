package com.bfe.project.controller.InfoColl;

import com.bfe.project.entity.InfoColl.InfoCollChildrenInfo;
import com.bfe.project.service.InfoColl.InfoCollChildrenInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/info-coll/children-info")
public class InfoCollChildrenInfoController {

    @Autowired
    private InfoCollChildrenInfoService infoCollChildrenInfoService;

    @PostMapping("/save-or-update")
    public Map<String, Object> saveOrUpdate(@RequestBody List<InfoCollChildrenInfo> childrenInfoList) {
        Map<String, Object> result = new HashMap<>();
        
        if (childrenInfoList != null && !childrenInfoList.isEmpty()) {
            // 获取第一个元素的clientCaseId（假设所有元素都有相同的clientCaseId）
            Integer clientCaseId = childrenInfoList.get(0).getClientCaseId();
            
            // 删除该case下的所有children记录
            infoCollChildrenInfoService.lambdaUpdate()
                    .eq(InfoCollChildrenInfo::getClientCaseId, clientCaseId)
                    .remove();
            
            // 批量保存新的children记录
            infoCollChildrenInfoService.saveBatch(childrenInfoList);
            result.put("status", "updated");
        } else {
            result.put("status", "no_data");
        }
        
        result.put("data", childrenInfoList);
        return result;
    }

    @GetMapping("/case/{clientCaseId}")
    public ResponseEntity<List<InfoCollChildrenInfo>> getByClientCaseId(@PathVariable Integer clientCaseId) {
        try {
            List<InfoCollChildrenInfo> childrenInfoList = infoCollChildrenInfoService.lambdaQuery()
                    .eq(InfoCollChildrenInfo::getClientCaseId, clientCaseId)
                    .orderByAsc(InfoCollChildrenInfo::getId)
                    .list();
            return ResponseEntity.ok(childrenInfoList);
        } catch (Exception e) {
            return ResponseEntity.ok(null);
        }
    }
} 