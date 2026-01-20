package com.mbg.repository;

import com.mbg.entity.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {
    
    List<Document> findByStatus(Document.DocumentStatus status);
    
    Page<Document> findByStatus(Document.DocumentStatus status, Pageable pageable);
    
    List<Document> findBySubmittedBy(UUID submittedBy);
    
    List<Document> findByDocumentType(Document.DocumentType documentType);
    
    Page<Document> findByDocumentType(Document.DocumentType documentType, Pageable pageable);
    
    List<Document> findByRelatedEntityTypeAndRelatedEntityId(String entityType, UUID entityId);
    
    Page<Document> findBySubmittedAtBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
    
    long countByStatus(Document.DocumentStatus status);
    
    Page<Document> findAllByOrderBySubmittedAtDesc(Pageable pageable);
}
