package com.bfe.project.entity.InfoColl;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

import java.util.Date;

@Data
@ToString
@TableName("info_coll_academic_history")
public class InfoCollAcademicHistory {
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 关联案件ID
    private Integer clientCaseId;

    // 学术历史信息
    private String respondents;
    private String degree;
    private String schoolName;
    private String status;
    private Date startDate;
    private Date endDate;
    private String major;
    private String docLanguage;
    private String transcriptsOriginal;
    private String transcriptsTranslated;
    private String diplomaOriginal;
    private String diplomaTranslated;
    private String country;
} 