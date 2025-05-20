package com.bfe.project.entity.InfoColl;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("info_coll_industry_supplemental_evidence")
public class InfoCollIndustrySupplementalEvidence {
    @TableId(type = IdType.AUTO)
    private Integer id;

    private Integer contributionId;

    // 补充证据信息
    private String evidenceType;
    private String evidenceLink;
    private String evidenceAttachment;
    private String evidenceRemarks;
} 