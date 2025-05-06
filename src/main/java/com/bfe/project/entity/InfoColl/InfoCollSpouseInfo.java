package com.bfe.project.entity.InfoColl;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("info_coll_spouse_info")
public class InfoCollSpouseInfo {
    @TableId(type = IdType.AUTO)
    private Integer id;


    // 关联案件ID
    private Integer clientCaseId;

    // 基本信息
    private String respondents;
    private String firstName;
    private String middleName;
    private String lastName;
    private String gender;
    private String dob;
    private String visaStatus;
} 