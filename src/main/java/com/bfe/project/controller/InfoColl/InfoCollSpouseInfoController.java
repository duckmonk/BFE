package com.bfe.project.controller.InfoColl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.bfe.project.entity.InfoColl.InfoCollSpouseInfo;
import com.bfe.project.service.InfoColl.InfoCollSpouseInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/info-coll/spouse-info")
public class InfoCollSpouseInfoController {

    @Autowired
    private InfoCollSpouseInfoService infoCollSpouseInfoService;

    @PostMapping("/upsert")
    public Map<String, Object> saveOrUpdate(@RequestBody InfoCollSpouseInfo spouseInfo) {
        Map<String, Object> result = new HashMap<>();
        
        // 根据clientCaseId查询是否存在记录
        InfoCollSpouseInfo existingInfo = infoCollSpouseInfoService.lambdaQuery()
                .eq(InfoCollSpouseInfo::getClientCaseId, spouseInfo.getClientCaseId())
                .one();
                
        if (existingInfo != null) {
            // 如果存在，设置ID进行更新
            spouseInfo.setId(existingInfo.getId());
            infoCollSpouseInfoService.updateById(spouseInfo);
            result.put("status", "updated");
        } else {
            // 如果不存在，进行插入
            infoCollSpouseInfoService.save(spouseInfo);
            result.put("status", "inserted");
        }
        
        result.put("data", spouseInfo);
        return result;
    }

    @GetMapping("/case/{clientCaseId}")
    public ResponseEntity<InfoCollSpouseInfo> getByClientCaseId(@PathVariable Integer clientCaseId) {
        try {
            LambdaQueryWrapper<InfoCollSpouseInfo> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(InfoCollSpouseInfo::getClientCaseId, clientCaseId);
            InfoCollSpouseInfo spouseInfo = infoCollSpouseInfoService.getOne(wrapper);
            return ResponseEntity.ok(spouseInfo);
        } catch (Exception e) {
            return ResponseEntity.ok(null);
        }
    }
} 