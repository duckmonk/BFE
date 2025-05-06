package com.bfe.project.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.bfe.project.entity.ClientCase;
import com.bfe.project.mapper.ClientCaseMapper;
import com.bfe.project.service.ClientCaseService;
import org.springframework.stereotype.Service;

/**
 * 客户案例 Service 实现类
 */
@Service
public class ClientCaseServiceImpl extends ServiceImpl<ClientCaseMapper, ClientCase> implements ClientCaseService {
} 