package com.bfe.project.entity.Task;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("task_recommendation_letters")
public class TaskRecommendationLetters {
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 关联案件ID
    private Integer clientCaseId;

    // 推荐信任务信息
    private String rlDraft;
    private String rlOverallFeedback;
    private String rlConfirm;
    private String rlSignedLetter;
} 