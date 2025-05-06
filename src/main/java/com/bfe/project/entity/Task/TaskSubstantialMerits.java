package com.bfe.project.entity.Task;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("task_substantial_merits")
public class TaskSubstantialMerits {
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 关联案件ID
    private Integer clientCaseId;

    // 实质性优点任务信息
    private String prong1SmDraft;
    private String prong1SmOverall;
    private String prong1SmConfirm;
} 