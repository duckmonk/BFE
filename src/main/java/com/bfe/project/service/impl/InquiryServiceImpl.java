package com.bfe.project.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.bfe.project.entity.Inquiry;
import com.bfe.project.mapper.InquiryMapper;
import com.bfe.project.service.InquiryService;
import org.springframework.stereotype.Service;

@Service
public class InquiryServiceImpl extends ServiceImpl<InquiryMapper, Inquiry> implements InquiryService {

    @Override
    public boolean updateById(Inquiry inquiry) {
        // 获取原始 Inquiry 数据
        Inquiry originalInquiry = getById(inquiry.getId());

        // 检查 bfeSendOutAttorneyInq 是否发生变化
        if (originalInquiry != null && !areEqual(originalInquiry.getBfeSendOutAttorneyInq(), inquiry.getBfeSendOutAttorneyInq())) {
            // 如果变化了，将 attorneyApprovedButton 设为 false
            inquiry.setAttorneyApprovedButton(false);
             // 可选：如果 attorneyApprovedButton 设为 false，也可以清空 attorneyApprovedTsInq
             // inquiry.setAttorneyApprovedTsInq(null);
        }

        // 执行更新
        return super.updateById(inquiry);
    }

    // Helper 方法比较两个 Integer 是否相等，处理 null 值
    private boolean areEqual(Integer a, Integer b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.equals(b);
    }
} 