package com.bfe.project.entity.Task;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("task_balancing_factors")
public class TaskBalancingFactors {
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 关联案件ID
    private Integer clientCaseId;

    // 平衡因素任务信息
    private String prong3BfDraft;
    private String prong3BfOverall;
    private String prong3BfConfirm;
} 