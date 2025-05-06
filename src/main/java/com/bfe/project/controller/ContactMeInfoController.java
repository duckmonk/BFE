package com.bfe.project.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bfe.project.entity.ContactMeInfo;
import com.bfe.project.service.ContactMeInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contact-me")
public class ContactMeInfoController {

    @Autowired
    private ContactMeInfoService contactMeInfoService;

    @GetMapping("/list")
    public List<ContactMeInfo> list() {
        return contactMeInfoService.list();
    }

    @GetMapping("/page")
    public Page<ContactMeInfo> page(@RequestParam(defaultValue = "1") Integer current,
                                   @RequestParam(defaultValue = "10") Integer size) {
        return contactMeInfoService.page(new Page<>(current, size));
    }
 
    @PostMapping("/save")
    public boolean save(@RequestBody ContactMeInfo contactMeInfo) {
        return contactMeInfoService.save(contactMeInfo);
    }

    @PutMapping("/update")
    public boolean update(@RequestBody ContactMeInfo contactMeInfo) {
        return contactMeInfoService.updateById(contactMeInfo);
    }

    @DeleteMapping("/{id}")
    public boolean delete(@PathVariable Integer id) {
        return contactMeInfoService.removeById(id);
    }

    @GetMapping("/{id}")
    public ContactMeInfo getById(@PathVariable Integer id) {
        return contactMeInfoService.getById(id);
    }
} 