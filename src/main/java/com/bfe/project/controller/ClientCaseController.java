package com.bfe.project.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bfe.project.entity.ClientCase;
import com.bfe.project.service.ClientCaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/client-case")
public class ClientCaseController {

    @Autowired
    private ClientCaseService clientCaseService;

    @GetMapping("/current")
    public Map<String, Object> getOrCreateCurrentCase() {
        // 获取当前登录用户ID
        Integer userId = StpUtil.getLoginIdAsInt();
        
        // 查询用户最新的case
        ClientCase existingCase = clientCaseService.lambdaQuery()
                .eq(ClientCase::getUserId, userId)
                .orderByDesc(ClientCase::getId)
                .last("LIMIT 1")
                .one();
                
        Map<String, Object> result = new HashMap<>();
        if (existingCase != null) {
            result.put("status", "success");
            result.put("clientCaseId", existingCase.getId());
            return result;
        }
        
        // 如果不存在case，创建新的case
        ClientCase newCase = new ClientCase();
        newCase.setUserId(userId);
        clientCaseService.save(newCase);
        
        result.put("status", "success");
        result.put("clientCaseId", newCase.getId());
        return result;
    }

    @GetMapping("/list")
    public List<ClientCase> list() {
        return clientCaseService.list();
    }

    @GetMapping("/page")
    public Page<ClientCase> page(@RequestParam(defaultValue = "1") Integer current,
                                @RequestParam(defaultValue = "10") Integer size) {
        return clientCaseService.page(new Page<>(current, size));
    }

    @PostMapping("/save")
    public boolean save(@RequestBody ClientCase clientCase) {
        return clientCaseService.save(clientCase);
    }

    @PutMapping("/update")
    public boolean update(@RequestBody ClientCase clientCase) {
        return clientCaseService.updateById(clientCase);
    }

    @DeleteMapping("/{id}")
    public boolean delete(@PathVariable Integer id) {
        return clientCaseService.removeById(id);
    }

    @GetMapping("/{id}")
    public ClientCase getById(@PathVariable Integer id) {
        return clientCaseService.getById(id);
    }

    @GetMapping("/user/{userId}")
    public List<ClientCase> getByUserId(@PathVariable Integer userId) {
        return clientCaseService.lambdaQuery()
                .eq(ClientCase::getUserId, userId)
                .list();
    }
} 