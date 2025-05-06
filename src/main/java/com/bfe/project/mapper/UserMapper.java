package com.bfe.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bfe.project.entity.User;

public interface UserMapper extends BaseMapper<User> {
    // BaseMapper已经提供了基础的CRUD方法
    // 如果需要自定义方法，可以在这里添加
}