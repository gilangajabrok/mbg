package com.mbg.repository;

import com.mbg.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    
    List<AuditLog> findByUserId(UUID userId);
    
    List<AuditLog> findByAction(String action);
    
    List<AuditLog> findByResourceType(String resourceType);
    
    List<AuditLog> findByResourceId(UUID resourceId);
    
    Page<AuditLog> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
    
    Page<AuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
