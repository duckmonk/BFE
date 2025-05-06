package com.bfe.project.entity.InfoColl;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("info_coll_niw_petition_supplemental_evidence")
public class InfoCollNiwPetitionSupplementalEvidence {
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 关联案件ID
    private Integer clientCaseId;

    // 补充证据信息
    private String evidenceType;
    private String evidenceLink;
    private String evidenceAttachment;
    private String evidenceRemarks;
} 