package com.mbg.controller;

import com.mbg.dto.ApiResponse;
import com.mbg.dto.DocumentDTO;
import com.mbg.dto.DocumentRejectRequest;
import com.mbg.dto.DocumentStatsDTO;
import com.mbg.dto.DocumentSubmitRequest;
import com.mbg.service.DocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/governance/documents")
@RequiredArgsConstructor
@PreAuthorize("hasRole('GREAT_ADMIN')")
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<DocumentDTO>> submitDocument(@Valid @RequestBody DocumentSubmitRequest request) {
        DocumentDTO document = documentService.submitDocument(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Document submitted for approval", document));
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<Page<DocumentDTO>>> getPendingDocuments(Pageable pageable) {
        Page<DocumentDTO> documents = documentService.getPendingDocuments(pageable);
        return ResponseEntity.ok(ApiResponse.success(documents));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<DocumentDTO>>> getAllDocuments(Pageable pageable) {
        Page<DocumentDTO> documents = documentService.getAllDocuments(pageable);
        return ResponseEntity.ok(ApiResponse.success(documents));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DocumentDTO>> getDocument(@PathVariable UUID id) {
        DocumentDTO document = documentService.getDocumentById(id);
        return ResponseEntity.ok(ApiResponse.success(document));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<DocumentDTO>> approveDocument(@PathVariable UUID id) {
        DocumentDTO document = documentService.approveDocument(id);
        return ResponseEntity.ok(ApiResponse.success("Document approved", document));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<DocumentDTO>> rejectDocument(
            @PathVariable UUID id,
            @Valid @RequestBody DocumentRejectRequest request
    ) {
        DocumentDTO document = documentService.rejectDocument(id, request);
        return ResponseEntity.ok(ApiResponse.success("Document rejected", document));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DocumentStatsDTO>> getDocumentStats() {
        DocumentStatsDTO stats = documentService.getDocumentStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
