package com.bfe.project.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.bfe.project.entity.Inquiry;
import com.bfe.project.service.InquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.List;

@RestController
@RequestMapping("/inquiry")
public class InquiryController {

    @Autowired
    private InquiryService inquiryService;

    @GetMapping("/page")
    public Page<Inquiry> page(@RequestParam(defaultValue = "1") Integer current,
                            @RequestParam(defaultValue = "10") Integer size,
                            @RequestParam(required = false) Long dateStart,
                            @RequestParam(required = false) Long dateEnd,
                            @RequestParam(required = false) String userType,
                            @RequestParam(required = false) Integer userId) {
        System.out.println("Request params:");
        System.out.println("current: " + current);
        System.out.println("size: " + size);
        System.out.println("dateStart: " + dateStart);
        System.out.println("dateEnd: " + dateEnd);
        System.out.println("userType: " + userType);
        System.out.println("userId: " + userId);

        LambdaQueryWrapper<Inquiry> queryWrapper = new LambdaQueryWrapper<>();

        queryWrapper.ge(dateStart != null, Inquiry::getCreateTimestamp, dateStart);
        queryWrapper.le(dateEnd != null, Inquiry::getCreateTimestamp, dateEnd);

        // 根据用户类型和ID过滤
        if ("lawyer".equals(userType) && userId != null) {
            queryWrapper.eq(Inquiry::getBfeSendOutAttorneyInq, userId);
        } else if ("employee".equals(userType) && userId != null) {
            queryWrapper.and(w -> w
                .eq(Inquiry::getPocInq, userId)
                .or()
                .eq(Inquiry::getReviewerInq, userId)
            );
        } else if ("admin".equals(userType) || "marketing_manager".equals(userType)) {
            // Admin 和 Marketing Manager 查看所有，不加用户过滤条件
        } else {
            // 其他用户类型或没有提供用户参数，返回空列表或根据需要处理
            // 为了避免 WHERE () 错误，当没有有效过滤条件时，不添加任何用户过滤
            // 如果需要对其他未明确处理的用户类型限制访问，可以在这里添加条件
             if (userType != null || userId != null) {
                 // 如果提供了用户类型或ID，但不是上述角色，可以添加一个永不为真的条件或抛异常
                 // 这里选择不添加条件，让其自然返回结果（可能是空，取决于日期过滤）
             }
        }

        return inquiryService.page(new Page<>(current, size), queryWrapper);
    }

    @PostMapping("/save")
    public boolean save(@RequestBody Inquiry inquiry) {
        if (inquiry.getId() == null) {
            inquiry.setCreateTimestamp(System.currentTimeMillis() / 1000);
        }
        return inquiryService.save(inquiry);
    }

    @PutMapping("/update")
    public boolean update(@RequestBody Inquiry inquiry) {
        return inquiryService.updateById(inquiry);
    }

    @DeleteMapping("/{id}")
    public boolean delete(@PathVariable Integer id) {
        return inquiryService.removeById(id);
    }

    @GetMapping("/{id}")
    public Inquiry getById(@PathVariable Integer id) {
        return inquiryService.getById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Inquiry> getByUserId(@PathVariable Integer userId) {
        return inquiryService.lambdaQuery()
                .eq(Inquiry::getUserId, userId)
                .list();
    }
} 