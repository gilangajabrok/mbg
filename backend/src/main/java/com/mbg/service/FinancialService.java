package com.mbg.service;

import com.mbg.entity.FinancialRecord;
import com.mbg.repository.FinancialRecordRepository;
import com.mbg.config.TenantContext;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class FinancialService {

    private final FinancialRecordRepository financialRecordRepository;

    @Transactional(readOnly = true)
    public Page<FinancialRecord> getAllRecords(Pageable pageable) {
        UUID organizationId = TenantContext.getTenantId();
        return financialRecordRepository.findByOrganizationId(organizationId, pageable);
    }

    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getSummary() {
        UUID organizationId = TenantContext.getTenantId();
        BigDecimal income = financialRecordRepository.sumIncomeByOrganizationId(organizationId);
        BigDecimal expense = financialRecordRepository.sumExpenseByOrganizationId(organizationId);
        
        income = income != null ? income : BigDecimal.ZERO;
        expense = expense != null ? expense : BigDecimal.ZERO;
        
        Map<String, BigDecimal> summary = new HashMap<>();
        summary.put("income", income);
        summary.put("expense", expense);
        summary.put("balance", income.subtract(expense));
        
        return summary;
    }

    public FinancialRecord createRecord(FinancialRecord record) {
        if (record.getOrganizationId() == null) {
            record.setOrganizationId(TenantContext.getTenantId());
        }
        if (record.getTransactionDate() == null) {
            record.setTransactionDate(LocalDateTime.now());
        }
        return financialRecordRepository.save(record);
    }

    public void deleteRecord(UUID id) {
        financialRecordRepository.deleteById(id);
    }
}
