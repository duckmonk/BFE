package com.bfe.project.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.bfe.project.entity.ContactMeInfo;
import com.bfe.project.mapper.ContactMeInfoMapper;
import com.bfe.project.service.ContactMeInfoService;
import org.springframework.stereotype.Service;

@Service
public class ContactMeInfoServiceImpl extends ServiceImpl<ContactMeInfoMapper, ContactMeInfo> implements ContactMeInfoService {
} 