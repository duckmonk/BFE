package com.bfe.project.entity.InfoColl;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("info_coll_industry_applicant_proof")
public class InfoCollIndustryApplicantProof {
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 关联案件ID
    private Integer projectEvidenceId;

    // 行业申请人证明信息
    private String proofType;
    private String proofLinks;
    private String proofFiles;
    private String proofExplanation;
} 