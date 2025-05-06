package com.bfe.project.controller.InfoColl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.bfe.project.entity.InfoColl.InfoCollResume;
import com.bfe.project.service.InfoColl.InfoCollResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/info-coll/resume")
public class InfoCollResumeController {

    @Autowired
    private InfoCollResumeService infoCollResumeService;

    @PostMapping("/save-or-update")
    public Map<String, Object> saveOrUpdate(@RequestBody InfoCollResume resume) {
        Map<String, Object> result = new HashMap<>();
        
        // 根据clientCaseId查询是否存在记录
        InfoCollResume existingResume = infoCollResumeService.lambdaQuery()
                .eq(InfoCollResume::getClientCaseId, resume.getClientCaseId())
                .one();
                
        if (existingResume != null) {
            // 如果存在，设置ID进行更新
            resume.setId(existingResume.getId());
            infoCollResumeService.updateById(resume);
            result.put("status", "updated");
        } else {
            // 如果不存在，进行插入
            infoCollResumeService.save(resume);
            result.put("status", "inserted");
        }
        
        result.put("data", resume);
        return result;
    }

    @GetMapping("/case/{clientCaseId}")
    public ResponseEntity<InfoCollResume> getByClientCaseId(@PathVariable Integer clientCaseId) {
        try {
            LambdaQueryWrapper<InfoCollResume> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(InfoCollResume::getClientCaseId, clientCaseId);
            InfoCollResume resume = infoCollResumeService.getOne(wrapper);
            return ResponseEntity.ok(resume);
        } catch (Exception e) {
            return ResponseEntity.ok(null);
        }
    }
} 