package com.demo.demo0.service;

import com.demo.demo0.pojo.Inquiry;
import com.demo.demo0.pojo.dto.InquiryDto;

import java.util.List;

public interface  IInquiryService {
    Inquiry add(InquiryDto inquiry);
    void delete(Integer id);
    Inquiry update(InquiryDto inquiry);
    Inquiry getById(Integer id);

    List<Inquiry> list();
}
