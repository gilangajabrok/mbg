package com.mbg.controller;

import com.mbg.dto.ApiResponse;
import com.mbg.dto.CreateOrganizationRequest;
import com.mbg.dto.OrganizationDTO;
import com.mbg.service.OrganizationService;
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
@RequestMapping("/governance/organizations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('GREAT_ADMIN')")
public class OrganizationController {

    private final OrganizationService organizationService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrganizationDTO>> createOrganization(
            @Valid @RequestBody CreateOrganizationRequest request
    ) {
        OrganizationDTO organization = organizationService.createOrganization(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Organization created successfully", organization));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrganizationDTO>>> getAllOrganizations(Pageable pageable) {
        Page<OrganizationDTO> organizations = organizationService.getAllOrganizations(pageable);
        return ResponseEntity.ok(ApiResponse.success(organizations));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrganizationDTO>> getOrganization(@PathVariable UUID id) {
        OrganizationDTO organization = organizationService.getOrganizationById(id);
        return ResponseEntity.ok(ApiResponse.success(organization));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OrganizationDTO>> updateOrganization(
            @PathVariable UUID id,
            @Valid @RequestBody CreateOrganizationRequest request
    ) {
        OrganizationDTO organization = organizationService.updateOrganization(id, request);
        return ResponseEntity.ok(ApiResponse.success("Organization updated successfully", organization));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrganization(@PathVariable UUID id) {
        organizationService.deleteOrganization(id);
        return ResponseEntity.ok(ApiResponse.success("Organization deleted successfully", null));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<OrganizationDTO>> activateOrganization(@PathVariable UUID id) {
        OrganizationDTO organization = organizationService.activateOrganization(id);
        return ResponseEntity.ok(ApiResponse.success("Organization activated", organization));
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<OrganizationDTO>> deactivateOrganization(@PathVariable UUID id) {
        OrganizationDTO organization = organizationService.deactivateOrganization(id);
        return ResponseEntity.ok(ApiResponse.success("Organization deactivated", organization));
    }
}
