package com.bfe.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("user")  // 指定表名
public class User {
    @TableId(type = IdType.AUTO)
    private Integer id;

    private String userType;
    private String name;
    private String password;
    private String email;
    private String status;
} 