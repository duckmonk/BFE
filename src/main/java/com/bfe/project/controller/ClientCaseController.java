package com.bfe.project.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bfe.project.controller.Task.TaskCenterController;
import com.bfe.project.entity.ClientCase;
import com.bfe.project.entity.User;
import com.bfe.project.service.ClientCaseService;
import com.bfe.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/client-case")
public class ClientCaseController {

    @Autowired
    private ClientCaseService clientCaseService;

    @Autowired
    private TaskCenterController taskCenterController;
    
    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public Map<String, Object> getByCaseId(@PathVariable Integer id) {
        // 查询用户最新的case
        ClientCase existingCase = clientCaseService.lambdaQuery()
                .eq(ClientCase::getId, id)
                .one();
                
        Map<String, Object> result = new HashMap<>();
        if (existingCase != null) {
            result.put("status", "success");
            result.put("clientCaseId", existingCase.getId());
            result.put("enabledTasks", taskCenterController.getEnabledTasks(existingCase.getId()));
            return result;
        }
        return null;
    }

    private Map<String, Object> getOrCreateCase(Integer userId) {
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
            result.put("enabledTasks", taskCenterController.getEnabledTasks(existingCase.getId()));
            return result;
        }
        
        // 如果不存在case，创建新的case
        ClientCase newCase = new ClientCase();
        newCase.setUserId(userId);
        newCase.setCreateTimestamp(System.currentTimeMillis() / 1000);
        clientCaseService.save(newCase);
        
        result.put("status", "success");
        result.put("clientCaseId", newCase.getId());
        Set<String> enabledTasks = new HashSet<>();
        enabledTasks.add("endeavor_submission");
        result.put("enabledTasks", enabledTasks);
        return result;
    }

    @GetMapping("/current")
    public Map<String, Object> getOrCreateCurrentCase() {
        // 获取当前登录用户ID
        Integer userId = StpUtil.getLoginIdAsInt();
        return getOrCreateCase(userId);
    }

    @GetMapping("/list")
    public List<ClientCase> list() {
        return clientCaseService.list();
    }

    @GetMapping("/page")
    public Page<Map<String, Object>> page(@RequestParam(defaultValue = "1") Integer current,
                                        @RequestParam(defaultValue = "10") Integer size,
                                        @RequestParam(required = false) Long dateStart,
                                        @RequestParam(required = false) Long dateEnd) {
        // 获取基础分页数据
        Page<ClientCase> casePage = clientCaseService.lambdaQuery()
                .ge(dateStart != null, ClientCase::getCreateTimestamp, dateStart)
                .le(dateEnd != null, ClientCase::getCreateTimestamp, dateEnd)
                .page(new Page<>(current, size));
        
        // 转换为包含用户信息和任务状态的Map
        Page<Map<String, Object>> resultPage = new Page<>(current, size, casePage.getTotal());
        List<Map<String, Object>> records = casePage.getRecords().stream().map(clientCase -> {
            Map<String, Object> record = new HashMap<>();
            // 基础信息
            record.put("id", clientCase.getId());
            record.put("createTimestamp", clientCase.getCreateTimestamp());
            
            // 用户信息
            User user = userService.getById(clientCase.getUserId());
            if (user != null) {
                record.put("userName", user.getName());
                record.put("userEmail", user.getEmail());
            }
            
            // 任务状态
            Map<String, Boolean> tasksStatus = taskCenterController.getTasksStatus(clientCase.getId());
            record.putAll(tasksStatus);
            
            return record;
        }).collect(Collectors.toList());
        
        resultPage.setRecords(records);
        return resultPage;
    }

    @PostMapping("/save")
    public boolean save(@RequestBody ClientCase clientCase) {
        if (clientCase.getId() == null) {
            clientCase.setCreateTimestamp(System.currentTimeMillis() / 1000);
        }
        return clientCaseService.save(clientCase);
    }

    @PutMapping("/update")
    public boolean update(@RequestBody ClientCase clientCase) {
        return clientCaseService.updateById(clientCase);
    }

    @GetMapping("/user/{userId}")
    public Map<String, Object> getByUserId(@PathVariable Integer userId) {
        return getOrCreateCase(userId);
    }
} 