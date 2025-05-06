package com.bfe.project.entity.InfoColl;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@TableName("info_coll_basic_info")
public class InfoCollBasicInfo {
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 关联案件ID
    private Integer clientCaseId;

    // 基本信息
    private String respondents;
    private String firstName;
    private String middleName;
    private String lastName;
    private String fullName;
    private String email;
    private String gender;
    private String premiumProcessing;
    private String phoneNumber;
    private String dob;
    private String ssn;
    private String birthLocation;
    private String citizenship;
    private String usAddress;
    private String foreignAddressNative;
    private String foreignAddressEng;
    private String residenceCountry;
    private String visaStatus;
    private Integer kidsCount;
    private String immigrationPetition;
    
    // 文件路径
    private String petitionNotice;
    private String passport;
    private String oldPassport;
    private String visaStamp;
    private String i94;
    private String nonimmigrantStatus;
    
    // 婚姻状况
    private String maritalStatus;
} 