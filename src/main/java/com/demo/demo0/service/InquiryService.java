package com.demo.demo0.service;

import com.demo.demo0.pojo.Inquiry;
import com.demo.demo0.pojo.dto.InquiryDto;
import com.demo.demo0.repo.InquiryRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InquiryService implements IInquiryService {
    @Autowired
    InquiryRepo inquiryRepo;

    @Override
    public Inquiry add(InquiryDto inquiryDto) {
        Inquiry newInquiry = new Inquiry();
        BeanUtils.copyProperties(inquiryDto, newInquiry);
        return inquiryRepo.save(newInquiry);
    }

    @Override
    public void delete(Integer id) {
        inquiryRepo.deleteById(id);
    }

    @Override
    public Inquiry update(InquiryDto inquiryDto) {
        Inquiry newInquiry = new Inquiry();
        BeanUtils.copyProperties(inquiryDto, newInquiry);
        return inquiryRepo.save(newInquiry);
    }

    @Override
    public Inquiry getById(Integer id) {
        return inquiryRepo.findById(id).orElse(null);
    }

    @Override
    public List<Inquiry> list() {
        return (List<Inquiry>) inquiryRepo.findAll();
    }
}