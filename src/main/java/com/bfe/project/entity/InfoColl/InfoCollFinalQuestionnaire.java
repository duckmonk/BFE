package com.bfe.project.entity.InfoColl;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("info_coll_final_questionnaire")
public class InfoCollFinalQuestionnaire {
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 关联案件ID
    private Integer clientCaseId;

    // 最终问卷信息
    private String respondents;
    private String changesSelected;
    private String passportChanges;
    private String passportDocuments;
    private String addressChanges;
    private String employerChanges;
    private String i94Changes;
    private String i94Documents;
    private String marriageStatus;
    private String spouseSubmission;
    private String childrenStatus;
    private String childrenSubmission;
    private String immigrationUpdates;
    private String immigrationDocuments;
} 