package com.bfe.project.entity.Task;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("task_well_positioned")
public class TaskWellPositioned {
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 关联案件ID
    private Integer clientCaseId;

    // 良好定位任务信息
    private String prong2WpDraft;
    private String prong2WpOverall;
    private String prong2WpConfirm;
} 