/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_case` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `create_timestamp` bigint NOT NULL DEFAULT '0',
  `basic_info_finished` tinyint(1) DEFAULT '0',
  `spouse_info_finished` tinyint(1) DEFAULT '0',
  `children_info_finished` tinyint(1) DEFAULT '0',
  `academic_history_finished` tinyint(1) DEFAULT '0',
  `employment_history_finished` tinyint(1) DEFAULT '0',
  `recommender_finished` tinyint(1) DEFAULT '0',
  `resume_finished` tinyint(1) DEFAULT '0',
  `niw_petition_finished` tinyint(1) DEFAULT '0',
  `pl_formatting` text,
  `immigration_forms` text,
  `pl_formatting_cls` text COMMENT 'LaTeX class file content',
  `type_of_petition` varchar(255) DEFAULT NULL COMMENT 'Type of petition (e.g., I-140, EB-2 National Interest Waiver)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_me_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info_coll_academic_contribution` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `niw_petition_id` int NOT NULL COMMENT '关联NIW申请ID',
  `contribution_title` varchar(255) DEFAULT NULL COMMENT '贡献标题',
  `funding_received` varchar(50) DEFAULT NULL COMMENT '是否获得资金',
  `impact` text COMMENT '影响',
  `industry_adoption` text COMMENT '行业采用情况',
  `publication` text COMMENT '发表情况',
  PRIMARY KEY (`id`),
  KEY `idx_niw_petition_id` (`niw_petition_id`) COMMENT 'NIW申请ID索引'
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='学术贡献信息表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info_coll_academic_funding` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `contribution_id` int NOT NULL COMMENT '关联学术贡献ID',
  `funding_category` varchar(100) DEFAULT NULL COMMENT '资金类别',
  `funding_links` text COMMENT '资金链接',
  `funding_attachments` text COMMENT '资金附件',
  `funding_remarks` text COMMENT '资金备注',
  PRIMARY KEY (`id`),
  KEY `idx_contribution_id` (`contribution_id`) COMMENT '学术贡献ID索引'
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='学术资金信息表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info_coll_academic_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_case_id` int NOT NULL,
  `respondents` varchar(255) DEFAULT NULL,
  `degree` varchar(50) DEFAULT NULL,
  `school_name` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `start_date` varchar(50) DEFAULT NULL,
  `end_date` varchar(50) DEFAULT NULL,
  `major` varchar(255) DEFAULT NULL,
  `doc_language` varchar(50) DEFAULT NULL,
  `transcripts_original` varchar(255) DEFAULT NULL,
  `transcripts_translated` varchar(255) DEFAULT NULL,
  `diploma_original` varchar(255) DEFAULT NULL,
  `diploma_translated` varchar(255) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_client_case_id` (`client_case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info_coll_academic_industry_adoption` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `contribution_id` int NOT NULL COMMENT '关联学术贡献ID',
  `industry_docs` text COMMENT '行业文档',
  `industry_links` text COMMENT '行业链接',
  `industry_attachments` text COMMENT '行业附件',
  `industry_remarks` text COMMENT '行业备注',
  PRIMARY KEY (`id`),
  KEY `idx_contribution_id` (`contribution_id`) COMMENT '学术贡献ID索引'
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='学术行业采纳信息表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info_coll_academic_policy_impact` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `contribution_id` int NOT NULL COMMENT '关联学术贡献ID',
  `impact_field` varchar(255) DEFAULT NULL COMMENT '影响领域',
  `impact_beneficiary` varchar(255) DEFAULT NULL COMMENT '受益者',
  `impact_links` text COMMENT '影响链接',
  `impact_attachments` text COMMENT '影响附件',
  `impact_remarks` text COMMENT '影响备注',
  PRIMARY KEY (`id`),
  KEY `idx_contribution_id` (`contribution_id`) COMMENT '学术贡献ID索引'
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='学术政策影响信息表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info_coll_academic_publication` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `contribution_id` int NOT NULL COMMENT '关联的贡献ID',
  `pub_institution` varchar(255) DEFAULT NULL COMMENT '出版机构',
  `pub_issn` varchar(50) DEFAULT NULL COMMENT 'ISSN号',
  `pub_ranking` varchar(50) DEFAULT NULL COMMENT '排名',
  `pub_title` varchar(255) DEFAULT NULL COMMENT '标题',
  `pub_citations` int DEFAULT NULL COMMENT '引用次数',
  `pub_practical_uses` text COMMENT '实际用途',
  `pub_tier` varchar(50) DEFAULT NULL COMMENT '等级',
  `pub_links` text COMMENT '链接',
  `pub_attachments` text COMMENT '附件',
  `pub_remarks` text COMMENT '备注',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_contribution_id` (`contribution_id`) COMMENT '贡献ID索引'
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='学术出版物信息表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info_coll_academic_supplemental_evidence` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `contribution_id` int NOT NULL COMMENT '关联的贡献ID',
  `evidence_type` varchar(50) DEFAULT NULL COMMENT '证据类型',
  `evidence_link` text COMMENT '证据链接',
  `evidence_attachment` text COMMENT '证据附件',
  `evidence_remarks` text COMMENT '证据备注',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_contribution_id` (`contribution_id`) COMMENT '贡献ID索引'
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='学术补充证据信息表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info_coll_basic_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_case_id` int DEFAULT NULL,
  `respondents` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `premium_processing` varchar(50) DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `dob` varchar(10) DEFAULT NULL,
  `ssn` varchar(50) DEFAULT NULL,
  `birth_location` varchar(255) DEFAULT NULL,
  `citizenship` varchar(255) DEFAULT NULL,
  `us_address` text,
  `foreign_address_native` text,
  `foreign_address_eng` text,
  `residence_country` varchar(50) DEFAULT NULL,
  `visa_status` varchar(50) DEFAULT NULL,
  `kids_count` int DEFAULT NULL,
  `immigration_petition` varchar(50) DEFAULT NULL,
  `petition_notice` varchar(255) DEFAULT NULL,
  `passport` varchar(255) DEFAULT NULL,
  `old_passport` varchar(255) DEFAULT NULL,
  `visa_stamp` varchar(255) DEFAULT NULL,
  `i94` varchar(255) DEFAULT NULL,
  `nonimmigrant_status` varchar(255) DEFAULT NULL,
  `marital_status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_client_case_id` (`client_case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info_coll_children_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_case_id` int NOT NULL,
  `respondents` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `dob` varchar(10) DEFAULT NULL,
  `visa_status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_client_case_id` (`client_case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info_coll_employment_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_case_id` int NOT NULL,
  `respondents` varchar(255) DEFAULT NULL,
  `employer_name` varchar(255) DEFAULT NULL,
  `current_employer` varchar(50) DEFAULT NULL,
  `employer_address` text,
  `place_of_employment` varchar(255) DEFAULT NULL,
  `business_type` varchar(255) DEFAULT NULL,
  `job_title` varchar(255) DEFAULT NULL,
  `salary` decimal(10,1) DEFAULT NULL,
  `start_date` varchar(50) DEFAULT NULL,
  `end_date` varchar(50) DEFAULT NULL,
  `hours_per_week` decimal(5,1) DEFAULT NULL,
  `job_summary` text,
  `employer_website` varchar(255) DEFAULT NULL,
  `employment_letter` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_client_case_id` (`client_case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info_coll_industry_applicant_proof` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_evidence_id` int DEFAULT NULL COMMENT '关联项目证据ID',
  `proof_type` varchar(255) DEFAULT NULL COMMENT '证明类型',
  `proof_links` text COMMENT '证明链接',
  `proof_files` text COMMENT '证明文件',
  `proof_explanation` text COMMENT '证明说明',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='行业申请人证明表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info_coll_industry_contribution` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_case_id` int DEFAULT NULL COMMENT '关联案件ID',
  `project_title` varchar(255) DEFAULT NULL COMMENT '项目标题',
  `project_background` text COMMENT '项目背景',
  `your_contribution` text COMMENT '您的贡献',
  `project_outcomes` text COMMENT '项目成果',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='行业贡献表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info_coll_industry_project_evidence` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contribution_id` int DEFAULT NULL COMMENT '关联贡献ID',
  `evidence_type` varchar(255) DEFAULT NULL COMMENT '证据类型',
  `evidence_links` text COMMENT '证据链接',
  `evidence_attachments` text COMMENT '证据附件',
  `evidence_remarks` text COMMENT '证据备注',
  `evidence_has_applicant_proof` varchar(255) DEFAULT NULL COMMENT '是否有申请人证明',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='行业项目证据表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info_coll_industry_supplemental_evidence` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contribution_id` int DEFAULT NULL COMMENT '关联贡献ID',
  `evidence_type` varchar(255) DEFAULT NULL COMMENT '证据类型',
  `evidence_link` text COMMENT '证据链接',
  `evidence_attachment` text COMMENT '证据附件',
  `evidence_remarks` text COMMENT '证据备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='行业补充证据表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info_coll_niw_petition` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `client_case_id` int NOT NULL COMMENT '关联案件ID',
  `user_path` varchar(255) DEFAULT NULL COMMENT 'NIW 申请信息路径',
  `respondents` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_client_case_id` (`client_case_id`) COMMENT '案件ID索引'
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='NIW申请信息表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info_coll_recommender` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `client_case_id` int DEFAULT NULL COMMENT '关联案件ID',
  `name` varchar(255) DEFAULT NULL COMMENT '推荐人姓名',
  `resume` text COMMENT '简历',
  `type` varchar(255) DEFAULT NULL COMMENT '类型',
  `code` varchar(255) DEFAULT NULL COMMENT '代码',
  `pronoun` varchar(255) DEFAULT NULL COMMENT '代词',
  `note` text COMMENT '备注',
  `linked_contributions` text COMMENT '关联贡献',
  `relationship` varchar(255) DEFAULT NULL COMMENT '关系',
  `relationship_other` varchar(255) DEFAULT NULL COMMENT '其他关系',
  `company` varchar(255) DEFAULT NULL COMMENT '公司',
  `department` varchar(255) DEFAULT NULL COMMENT '部门',
  `title` varchar(255) DEFAULT NULL COMMENT '职位',
  `meet_date` varchar(50) DEFAULT NULL COMMENT '见面日期',
  `eval_aspects` text COMMENT '评估方面',
  `eval_aspects_other` text COMMENT '其他评估方面',
  `independent_eval` text COMMENT '独立评估',
  `characteristics` text COMMENT '特征',
  `relationship_story` text COMMENT '关系故事',
  PRIMARY KEY (`id`),
  KEY `idx_client_case_id` (`client_case_id`) COMMENT '案件ID索引'
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='推荐人信息表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info_coll_resume` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `client_case_id` int NOT NULL COMMENT '关联案件ID',
  `respondents` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '简历信息',
  `file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '文件',
  PRIMARY KEY (`id`),
  KEY `idx_client_case_id` (`client_case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='信息收集-简历表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info_coll_spouse_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_case_id` int DEFAULT NULL,
  `respondents` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `dob` varchar(10) DEFAULT NULL,
  `visa_status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_client_case_id` (`client_case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inquiry` (
  `id` int NOT NULL AUTO_INCREMENT,
  `petitioner_email` varchar(255) DEFAULT NULL,
  `petitioner_name` varchar(255) DEFAULT NULL,
  `petitioner_field` varchar(255) DEFAULT NULL,
  `impact_benefits` tinyint(1) DEFAULT NULL,
  `impact_us_gov` tinyint(1) DEFAULT NULL,
  `impact_recognition` tinyint(1) DEFAULT NULL,
  `role_verified` tinyint(1) DEFAULT NULL,
  `impact_applied` tinyint(1) DEFAULT NULL,
  `impact_applied_note` text,
  `achievements_speaking` tinyint(1) DEFAULT NULL,
  `achievements_speaking_note` text,
  `achievements_funding` tinyint(1) DEFAULT NULL,
  `achievements_funding_note` text,
  `achievements_gov` tinyint(1) DEFAULT NULL,
  `achievements_gov_note` text,
  `achievements_offers` tinyint(1) DEFAULT NULL,
  `achievements_offers_note` text,
  `achievements_media` tinyint(1) DEFAULT NULL,
  `achievements_media_note` text,
  `social_platform` varchar(50) DEFAULT NULL,
  `social_platform_other` text,
  `user_id` int DEFAULT NULL,
  `create_timestamp` int NOT NULL,
  `social_handle_inq` varchar(255) DEFAULT NULL COMMENT 'What is your social media handle?',
  `niw_score_inq` int DEFAULT NULL COMMENT 'What is the NIW evaluation score?',
  `send_out_calendar_date_inq` bigint DEFAULT NULL COMMENT 'When is the scheduled NIW discussion?',
  `total_price_inq` decimal(10,2) DEFAULT NULL COMMENT 'What is the total service price?',
  `first_payment_inq` decimal(10,2) DEFAULT NULL COMMENT 'What is the first payment amount?',
  `second_payment_inq` decimal(10,2) DEFAULT NULL COMMENT 'What is the second payment amount?',
  `second_payment_note_inq` varchar(255) DEFAULT NULL COMMENT 'What is the occasion of the second payment?',
  `third_payment_inq` decimal(10,2) DEFAULT NULL COMMENT 'What is the third payment amount?',
  `third_payment_note_inq` varchar(255) DEFAULT NULL COMMENT 'What is the occasion of the third payment?',
  `bfe_approved_button` tinyint(1) DEFAULT NULL COMMENT 'Has BFE approval been granted?',
  `bfe_approved_ts_inq` bigint DEFAULT NULL COMMENT 'When was BFE approval granted?',
  `bfe_send_out_attorney_inq` int DEFAULT NULL,
  `attorney_approved_button` tinyint(1) DEFAULT NULL COMMENT 'Has attorney approval been granted?',
  `attorney_approved_ts_inq` bigint DEFAULT NULL COMMENT 'When did the attorney approve the case?',
  `attorney_firm_inq` varchar(255) DEFAULT NULL COMMENT 'What is the attorney''s firm name?',
  `poc_inq` int DEFAULT NULL,
  `reviewer_inq` int DEFAULT NULL,
  `case_status_bfe_inq` varchar(255) DEFAULT 'OPEN' COMMENT 'What is the current case status',
  `case_details` text COMMENT 'The execution of the case',
  `case_uscis_num_inq` varchar(255) DEFAULT NULL,
  `case_uscis_center_inq` varchar(255) DEFAULT NULL,
  `case_uscis_reviewer_inq` varchar(255) DEFAULT NULL,
  `case_uscis_result_inq` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_balancing_factors` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `client_case_id` int NOT NULL COMMENT '关联案件ID',
  `prong3_bf_draft` text COMMENT '平衡因素任务草稿',
  `prong3_bf_overall` text COMMENT '平衡因素任务整体反馈',
  `prong3_bf_confirm` text COMMENT '平衡因素任务确认信息',
  PRIMARY KEY (`id`),
  KEY `idx_client_case_id` (`client_case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='平衡因素任务表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_endeavor_submission` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `client_case_id` int NOT NULL COMMENT '关联案件ID',
  `endeavor_draft` text COMMENT '草稿',
  `endeavor_feedback` text COMMENT '反馈',
  `endeavor_confirm` text COMMENT '确认',
  `endeavor_final` text COMMENT '最终版本',
  PRIMARY KEY (`id`),
  KEY `idx_client_case_id` (`client_case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='任务提交表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_final_questionnaire` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `client_case_id` int NOT NULL COMMENT '关联案件ID',
  `respondents` varchar(255) DEFAULT NULL COMMENT '受访者',
  `changes_selected` varchar(255) DEFAULT NULL COMMENT '选择的变更',
  `passport_changes` varchar(255) DEFAULT NULL COMMENT '护照变更',
  `passport_documents` varchar(255) DEFAULT NULL COMMENT '护照文件',
  `address_changes` varchar(255) DEFAULT NULL COMMENT '地址变更',
  `employer_changes` varchar(255) DEFAULT NULL COMMENT '雇主变更',
  `i94_changes` varchar(255) DEFAULT NULL COMMENT 'I-94变更',
  `i94_documents` varchar(255) DEFAULT NULL COMMENT 'I-94文件',
  `marriage_status` varchar(255) DEFAULT NULL COMMENT '婚姻状况',
  `spouse_submission` varchar(255) DEFAULT NULL COMMENT '配偶提交',
  `children_status` varchar(255) DEFAULT NULL COMMENT '子女状况',
  `children_submission` varchar(255) DEFAULT NULL COMMENT '子女提交',
  `immigration_updates` varchar(255) DEFAULT NULL COMMENT '移民更新',
  `immigration_documents` varchar(255) DEFAULT NULL COMMENT '移民文件',
  `final_questionnaire_draft` text COMMENT '最终问卷草稿',
  `final_questionnaire_overall` text COMMENT '最终问卷整体反馈',
  `final_questionnaire_confirm` varchar(255) DEFAULT NULL COMMENT '最终问卷确认',
  `create_timestamp` bigint DEFAULT NULL COMMENT '创建时间',
  `update_timestamp` bigint DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_client_case_id` (`client_case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='最终问卷任务表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_future_plan` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `client_case_id` int NOT NULL COMMENT '关联案件ID',
  `futureplan_draft` text COMMENT '草稿',
  `futureplan_short` text COMMENT '短期计划',
  `futureplan_long` text COMMENT '长期计划',
  `futureplan_referees` text COMMENT '推荐人',
  `futureplan_feedback` text COMMENT '反馈',
  `futureplan_submit_draft` text COMMENT '提交草稿',
  `futureplan_confirm` text COMMENT '确认',
  `futureplan_referee_notes` text COMMENT '推荐人notes',
  PRIMARY KEY (`id`),
  KEY `idx_client_case_id` (`client_case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='未来计划任务表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_national_importance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_case_id` int NOT NULL,
  `prong1_ni_draft` text,
  `prong1_ni_overall` text,
  `prong1_ni_confirmation` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_client_case_id` (`client_case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_recommendation_letter` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `client_case_id` int NOT NULL COMMENT '关联案件ID',
  `rl_referee_name` varchar(255) NOT NULL COMMENT '推荐人姓名',
  `rl_draft` text COMMENT '推荐信草稿',
  `rl_overall_feedback` text COMMENT '整体反馈',
  `rl_confirm` text COMMENT '确认信息',
  `rl_signed_letter` text COMMENT '签名推荐信',
  PRIMARY KEY (`id`),
  KEY `idx_client_case_id` (`client_case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='推荐信表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_substantial_merits` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `client_case_id` int NOT NULL COMMENT '关联案件ID',
  `prong1_sm_draft` text COMMENT '实质性优点任务草稿',
  `prong1_sm_overall` text COMMENT '实质性优点任务整体反馈',
  `prong1_sm_confirm` text COMMENT '实质性优点任务确认信息',
  PRIMARY KEY (`id`),
  KEY `idx_client_case_id` (`client_case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='实质性优点任务表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_well_positioned` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `client_case_id` int NOT NULL COMMENT '关联案件ID',
  `prong2_wp_draft` text COMMENT '良好定位任务草稿',
  `prong2_wp_overall` text COMMENT '良好定位任务整体反馈',
  `prong2_wp_confirm` text COMMENT '良好定位任务确认信息',
  PRIMARY KEY (`id`),
  KEY `idx_client_case_id` (`client_case_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='良好定位任务表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_type` varchar(20) DEFAULT NULL COMMENT '用户类型',
  `name` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码',
  `status` varchar(20) DEFAULT 'active' COMMENT '状态',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `email` varchar(255) DEFAULT NULL,
  `firm_name` varchar(255) DEFAULT NULL COMMENT 'Firm Name',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户表';
/*!40101 SET character_set_client = @saved_cs_client */;
