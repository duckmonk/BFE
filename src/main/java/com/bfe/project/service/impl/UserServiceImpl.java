package com.bfe.project.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.bfe.project.entity.User;
import com.bfe.project.mapper.UserMapper;
import com.bfe.project.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
    // 实现特定的业务方法
} 