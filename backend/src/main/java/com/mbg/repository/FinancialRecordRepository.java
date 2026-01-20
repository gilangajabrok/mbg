package com.mbg.repository;

import com.mbg.entity.FinancialRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.UUID;

@Repository
public interface FinancialRecordRepository extends JpaRepository<FinancialRecord, UUID> {
    
    Page<FinancialRecord> findByOrganizationId(UUID organizationId, Pageable pageable);
    
    @Query("SELECT SUM(f.amount) FROM FinancialRecord f WHERE f.organizationId = :organizationId AND f.type = 'INCOME'")
    BigDecimal sumIncomeByOrganizationId(UUID organizationId);
    
    @Query("SELECT SUM(f.amount) FROM FinancialRecord f WHERE f.organizationId = :organizationId AND f.type = 'EXPENSE'")
    BigDecimal sumExpenseByOrganizationId(UUID organizationId);
}
