package com.bfe.project.entity.Task;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("task_endeavor_submission")
public class TaskEndeavorSubmission {
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 关联案件ID
    private Integer clientCaseId;

    // 任务提交信息
    private String endeavorDraft;
    private String endeavorFeedback;
    private String endeavorConfirm;
    private String endeavorFinal;
} 