package com.bfe.project.entity.Task;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("task_final_questionnaire")
public class TaskFinalQuestionnaire {
    @TableId(type = IdType.AUTO)
    private Integer id;
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
    
    // 任务相关字段
    private String finalQuestionnaireDraft;
    private String finalQuestionnaireOverall;
    private String finalQuestionnaireConfirm;
    private Long createTimestamp;
    private Long updateTimestamp;
} 