package com.demo.demo0.controller;

import com.demo.demo0.pojo.ResponseMessage;
import com.demo.demo0.pojo.Inquiry;
import com.demo.demo0.pojo.dto.InquiryDto;
import com.demo.demo0.service.IInquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inquiry")
public class InquiryController {
    @Autowired
    IInquiryService inquiryService;

    @PostMapping("/upsert")
    public ResponseMessage<Inquiry> upsertInquiry(@RequestBody InquiryDto inquiryDto) {
        Inquiry inquiry = inquiryService.add(inquiryDto);
        return ResponseMessage.success(inquiry);
    }

    @PostMapping("/delete")
    public ResponseMessage<String> deleteInquiry(@RequestBody Integer id) {
        inquiryService.delete(id);
        return ResponseMessage.success("delete success");
    }

    @GetMapping("/get")
    public ResponseMessage<Inquiry> getInquiry(@RequestParam Integer id) {
        return ResponseMessage.success(inquiryService.getById(id));
    }

    @GetMapping("/list")
    public ResponseMessage<List<Inquiry>> listInquiry() {
        return ResponseMessage.success(inquiryService.list());
    }

}