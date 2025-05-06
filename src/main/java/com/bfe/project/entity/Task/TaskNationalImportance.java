package com.bfe.project.entity.Task;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("task_national_importance")
public class TaskNationalImportance {
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 关联案件ID
    private Integer clientCaseId;

    // 国家重要性任务信息
    private String prong1NiDraft;
    private String prong1NiOverall;
    private String prong1NiConfirmation;
} 