package com.bfe.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.util.HashMap;
import java.util.Map;
import java.lang.reflect.Field;

@TableName("client_case")
@Data
public class ClientCase {
    @TableId(type = IdType.AUTO)
    private Integer id;

    private Integer userId;
    private long createTimestamp;

    // 信息收集完成状态
    private Boolean basicInfoFinished = false;

    private Boolean spouseInfoFinished = false;

    private Boolean childrenInfoFinished = false;

    private Boolean academicHistoryFinished = false;

    private Boolean employmentHistoryFinished = false;

    private Boolean recommenderFinished = false;

    private Boolean resumeFinished = false;

    private Boolean niwPetitionFinished = false;


    // PL Formatting LaTeX cls content
    private String plFormattingCls;

    // PL Formatting LaTeX content
    private String plFormatting;


    // Immigration Forms file URL
    private String immigrationForms;

    // PL formatting页面的输入
    private String typeOfPetition;
    private String exhibitList;
    private String premiumProcess;
    private String beneficiaryWorkState;
    private String mailingService;

    private String convertFieldName(String fieldName) {
        if ("id".equals(fieldName)) {
            return "clientCaseId";
        }
        return fieldName;
    }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        try {
            for (Field field : this.getClass().getDeclaredFields()) {
                field.setAccessible(true);
                String fieldName = convertFieldName(field.getName());
                Object value = field.get(this);
                map.put(fieldName, value);
            }
        } catch (IllegalAccessException e) {
            throw new RuntimeException("Failed to convert ClientCase to map", e);
        }
        return map;
    }
} 