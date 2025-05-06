package com.bfe.project.entity.InfoColl;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

import java.util.Date;

@Data
@ToString
@TableName("info_coll_recommender")
public class InfoCollRecommender {
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 关联案件ID
    private Integer clientCaseId;

    // 推荐人基本信息
    private String name;
    private String resume;
    private String type;
    private String code;
    private String pronoun;
    private String note;
    private String linkedContributions;
    private String relationship;
    private String relationshipOther;
    private String company;
    private String department;
    private String title;
    private Date meetDate;
    private String evalAspects;
    private String evalAspectsOther;
    private String independentEval;
    private String characteristics;
    private String relationshipStory;
} 