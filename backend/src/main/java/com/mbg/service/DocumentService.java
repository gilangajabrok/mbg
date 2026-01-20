package com.mbg.service;

import com.mbg.dto.DocumentDTO;
import com.mbg.dto.DocumentRejectRequest;
import com.mbg.dto.DocumentStatsDTO;
import com.mbg.dto.DocumentSubmitRequest;
import com.mbg.entity.Document;
import com.mbg.entity.User;
import com.mbg.exception.MbgException;
import com.mbg.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final AuditService auditService;

    @Transactional
    public DocumentDTO submitDocument(DocumentSubmitRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Document.DocumentType documentType;
        try {
            documentType = Document.DocumentType.valueOf(request.getDocumentType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw MbgException.badRequest("Invalid document type: " + request.getDocumentType());
        }

        Document document = Document.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .documentType(documentType)
                .status(Document.DocumentStatus.PENDING)
                .submittedBy(currentUser.getId())
                .submittedAt(LocalDateTime.now())
                .relatedEntityType(request.getRelatedEntityType())
                .relatedEntityId(request.getRelatedEntityId())
                .documentUrl(request.getDocumentUrl())
                .build();

        document = documentRepository.save(document);
        log.info("Document submitted for approval: {} by user: {}", document.getId(), currentUser.getEmail());

        // Audit log
        auditService.log("DOCUMENT_SUBMIT", "DOCUMENT", document.getId(),
                "Document submitted: " + document.getTitle());

        return mapToDTO(document);
    }

    @Transactional
    public DocumentDTO approveDocument(UUID documentId) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> MbgException.notFound("Document"));

        if (document.getStatus() != Document.DocumentStatus.PENDING) {
            throw MbgException.badRequest("Document is not pending approval");
        }

        document.setStatus(Document.DocumentStatus.APPROVED);
        document.setReviewedBy(currentUser.getId());
        document.setApprovedBy(currentUser.getId());
        document.setReviewedAt(LocalDateTime.now());

        document = documentRepository.save(document);
        log.info("Document approved: {} by user: {}", document.getId(), currentUser.getEmail());

        // Audit log
        auditService.log("DOCUMENT_APPROVE", "DOCUMENT", document.getId(),
                "Document approved: " + document.getTitle());

        return mapToDTO(document);
    }

    @Transactional
    public DocumentDTO rejectDocument(UUID documentId, DocumentRejectRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> MbgException.notFound("Document"));

        if (document.getStatus() != Document.DocumentStatus.PENDING) {
            throw MbgException.badRequest("Document is not pending approval");
        }

        document.setStatus(Document.DocumentStatus.REJECTED);
        document.setReviewedBy(currentUser.getId());
        document.setReviewedAt(LocalDateTime.now());
        document.setRejectionReason(request.getRejectionReason());

        document = documentRepository.save(document);
        log.info("Document rejected: {} by user: {}", document.getId(), currentUser.getEmail());

        // Audit log
        auditService.log("DOCUMENT_REJECT", "DOCUMENT", document.getId(),
                "Document rejected: " + document.getTitle() + " - Reason: " + request.getRejectionReason());

        return mapToDTO(document);
    }

    public Page<DocumentDTO> getPendingDocuments(Pageable pageable) {
        return documentRepository.findByStatus(Document.DocumentStatus.PENDING, pageable)
                .map(this::mapToDTO);
    }

    public Page<DocumentDTO> getAllDocuments(Pageable pageable) {
        return documentRepository.findAllByOrderBySubmittedAtDesc(pageable)
                .map(this::mapToDTO);
    }

    public DocumentDTO getDocumentById(UUID id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> MbgException.notFound("Document"));
        return mapToDTO(document);
    }

    public DocumentStatsDTO getDocumentStats() {
        return DocumentStatsDTO.builder()
                .totalDocuments(documentRepository.count())
                .pendingDocuments(documentRepository.countByStatus(Document.DocumentStatus.PENDING))
                .approvedDocuments(documentRepository.countByStatus(Document.DocumentStatus.APPROVED))
                .rejectedDocuments(documentRepository.countByStatus(Document.DocumentStatus.REJECTED))
                .build();
    }

    private DocumentDTO mapToDTO(Document document) {
        return DocumentDTO.builder()
                .id(document.getId())
                .title(document.getTitle())
                .description(document.getDescription())
                .documentType(document.getDocumentType().name())
                .status(document.getStatus().name())
                .submittedBy(document.getSubmittedBy())
                .reviewedBy(document.getReviewedBy())
                .approvedBy(document.getApprovedBy())
                .submittedAt(document.getSubmittedAt())
                .reviewedAt(document.getReviewedAt())
                .relatedEntityType(document.getRelatedEntityType())
                .relatedEntityId(document.getRelatedEntityId())
                .documentUrl(document.getDocumentUrl())
                .rejectionReason(document.getRejectionReason())
                .createdAt(document.getCreatedAt())
                .build();
    }
}
