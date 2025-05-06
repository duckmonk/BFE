package com.bfe.project.controller.InfoColl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.bfe.project.entity.InfoColl.InfoCollBasicInfo;
import com.bfe.project.service.InfoColl.InfoCollBasicInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/info-coll/basic-info")
public class InfoCollBasicInfoController {

    @Autowired
    private InfoCollBasicInfoService infoCollBasicInfoService;

    @PostMapping("/save")
    public ResponseEntity<InfoCollBasicInfo> save(@RequestBody InfoCollBasicInfo basicInfo) {
        infoCollBasicInfoService.save(basicInfo);
        return ResponseEntity.ok(basicInfo);
    }

    @GetMapping("/case/{clientCaseId}")
    public ResponseEntity<InfoCollBasicInfo> getByClientCaseId(@PathVariable Integer clientCaseId) {
        try {
            LambdaQueryWrapper<InfoCollBasicInfo> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(InfoCollBasicInfo::getClientCaseId, clientCaseId);
            InfoCollBasicInfo basicInfo = infoCollBasicInfoService.getOne(wrapper);
            return ResponseEntity.ok(basicInfo);
        } catch (Exception e) {
            return ResponseEntity.ok(null);
        }
    }

    @PostMapping("/save-or-update")
    public Map<String, Object> saveOrUpdate(@RequestBody InfoCollBasicInfo basicInfo) {
        Map<String, Object> result = new HashMap<>();
        
        // 根据clientCaseId查询是否存在记录
        InfoCollBasicInfo existingInfo = infoCollBasicInfoService.lambdaQuery()
                .eq(InfoCollBasicInfo::getClientCaseId, basicInfo.getClientCaseId())
                .one();
                
        if (existingInfo != null) {
            // 如果存在，设置ID进行更新
            basicInfo.setId(existingInfo.getId());
            infoCollBasicInfoService.updateById(basicInfo);
            result.put("status", "updated");
        } else {
            // 如果不存在，进行插入
            infoCollBasicInfoService.save(basicInfo);
            result.put("status", "inserted");
        }
        
        result.put("data", basicInfo);
        return result;
    }
} 