package com.bfe.project.entity.InfoColl;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("info_coll_industry_contribution")
public class InfoCollIndustryContribution {
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 关联案件ID
    private Integer clientCaseId;

    // 行业贡献信息
    private String projectTitle;
    private String projectBackground;
    private String yourContribution;
    private String projectOutcomes;
} 