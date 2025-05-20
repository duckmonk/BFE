package com.bfe.project.entity.InfoColl;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.Date;

@Data
@ToString
@TableName("info_coll_employment_history")
public class InfoCollEmploymentHistory {
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 关联案件ID
    private Integer clientCaseId;

    // 工作历史信息
    private String respondents;
    private String employerName;
    private String currentEmployer;
    private String employerAddress;
    private String placeOfEmployment;
    private String businessType;
    private String jobTitle;
    private BigDecimal salary;
    private String startDate;
    private String endDate;
    private BigDecimal hoursPerWeek;
    private String jobSummary;
    private String employerWebsite;
    private String employmentLetter;
} 