package com.bfe.project.entity.InfoColl;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("info_coll_academic_contribution")
public class InfoCollAcademicContribution {
    @TableId(type = IdType.AUTO)
    private Integer id;

    private Integer niwPetitionId;

    // 学术贡献信息
    private String contributionTitle;
    private String fundingReceived;
    private String impact;
    private String industryAdoption;
    private String publication;
} 