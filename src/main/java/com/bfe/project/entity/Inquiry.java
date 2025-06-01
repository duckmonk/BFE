package com.bfe.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("inquiry")
public class Inquiry {
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 关联用户ID
    private Integer userId;
    private long createTimestamp;

    // 基本信息
    private String petitionerEmail;
    private String petitionerName;
    private String petitionerField;

    // 影响力相关
    private Boolean impactBenefits;
    private Boolean impactUsGov;
    private Boolean impactRecognition;
    private Boolean roleVerified;
    private Boolean impactApplied;
    private String impactAppliedNote;

    // 成就相关
    private Boolean achievementsSpeaking;
    private String achievementsSpeakingNote;
    private Boolean achievementsFunding;
    private String achievementsFundingNote;
    private Boolean achievementsGov;
    private String achievementsGovNote;
    private Boolean achievementsOffers;
    private String achievementsOffersNote;
    private Boolean achievementsMedia;
    private String achievementsMediaNote;

    // 社交平台相关
    private String socialPlatform;
    private String socialPlatformOther;

    // 社交媒体相关
    private String socialHandleInq;

    // NIW评估相关
    private Integer niwScoreInq;
    private Long sendOutCalendarDateInq;

    // 价格相关
    private java.math.BigDecimal totalPriceInq;
    private java.math.BigDecimal firstPaymentInq;
    private java.math.BigDecimal secondPaymentInq;
    private String secondPaymentNoteInq;
    private java.math.BigDecimal thirdPaymentInq;
    private String thirdPaymentNoteInq;

    // BFE审批相关
    private Boolean bfeApprovedButton;
    private Long bfeApprovedTsInq;

    private Integer bfeSendOutAttorneyInq;

    // 律师审批相关
    private Boolean attorneyApprovedButton;
    private Long attorneyApprovedTsInq;
    private String attorneyFirmInq;

    // 案件管理相关
    private Integer pocInq;
    private Integer reviewerInq;
    private String caseStatusBfeInq;

    // USCIS相关
    private String caseUscisNumInq;
    private String caseUscisCenterInq;
    private String caseUscisReviewerInq;
    private String caseUscisResultInq;
} 