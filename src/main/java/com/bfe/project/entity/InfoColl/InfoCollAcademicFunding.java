package com.bfe.project.entity.InfoColl;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("info_coll_academic_funding")
public class InfoCollAcademicFunding {
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 关联案件ID
    private Integer clientCaseId;

    // 学术资金信息
    private String fundingCategory;
    private String fundingLinks;
    private String fundingAttachments;
    private String fundingRemarks;
} 