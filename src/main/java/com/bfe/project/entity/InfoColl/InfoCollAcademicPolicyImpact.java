package com.bfe.project.entity.InfoColl;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("info_coll_academic_policy_impact")
public class InfoCollAcademicPolicyImpact {
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 关联案件ID
    private Integer clientCaseId;

    // 学术政策影响信息
    private String impactField;
    private String impactBeneficiary;
    private String impactLinks;
    private String impactAttachments;
    private String impactRemarks;
} 