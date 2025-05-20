package com.bfe.project.entity.InfoColl;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("info_coll_academic_industry_adoption")
public class InfoCollAcademicIndustryAdoption {
    @TableId(type = IdType.AUTO)
    private Integer id;
    
    private Integer contributionId;

    // 学术行业采纳信息
    private String industryDocs;
    private String industryLinks;
    private String industryAttachments;
    private String industryRemarks;
} 