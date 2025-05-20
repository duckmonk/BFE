package com.bfe.project.entity.Task;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("task_future_plan")
public class TaskFuturePlan {
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 关联案件ID
    private Integer clientCaseId;

    // 未来计划任务信息
    private String futureplanDraft;
    private String futureplanShort;
    private String futureplanLong;
    private String futureplanReferees;
    private String futureplanRefereeNotes;
    private String futureplanFeedback;
    private String futureplanSubmitDraft;
    private String futureplanConfirm;
} 