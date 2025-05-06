package com.bfe.project.entity.InfoColl;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("info_coll_industry_project_evidence")
public class InfoCollIndustryProjectEvidence {
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 关联案件ID
    private Integer clientCaseId;

    // 行业项目证据信息
    private String evidenceType;
    private String evidenceLinks;
    private String evidenceAttachments;
    private String evidenceRemarks;
    private String evidenceHasApplicantProof;
} 