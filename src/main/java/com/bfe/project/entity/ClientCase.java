package com.bfe.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@TableName("client_case")
@Data
public class ClientCase {
    @TableId(type = IdType.AUTO)
    private Integer id;

    private Integer userId;
    private long createTimestamp;
} 