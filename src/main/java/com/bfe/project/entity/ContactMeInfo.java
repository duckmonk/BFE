package com.bfe.project.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("contact_me_info")
public class ContactMeInfo {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String message;
} 