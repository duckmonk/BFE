package com.bfe.project.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
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
                            @RequestParam(required = false) Long dateEnd) {
        System.out.println("Request params:");
        System.out.println("current: " + current);
        System.out.println("size: " + size);
        System.out.println("dateStart: " + dateStart);
        System.out.println("dateEnd: " + dateEnd);
        return inquiryService.lambdaQuery()
                .ge(dateStart != null, Inquiry::getCreateTimestamp, dateStart)
                .le(dateEnd != null, Inquiry::getCreateTimestamp, dateEnd)
                .page(new Page<>(current, size));
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