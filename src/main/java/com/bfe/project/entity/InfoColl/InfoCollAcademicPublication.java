package com.bfe.project.entity.InfoColl;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("info_coll_academic_publication")
public class InfoCollAcademicPublication {
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 关联案件ID
    private Integer clientCaseId;

    // 学术出版物信息
    private String pubInstitution;
    private String pubIssn;
    private String pubRanking;
    private String pubTitle;
    private Integer pubCitations;
    private String pubPracticalUses;
    private String pubTier;
    private String pubLinks;
    private String pubAttachments;
    private String pubRemarks;
} 