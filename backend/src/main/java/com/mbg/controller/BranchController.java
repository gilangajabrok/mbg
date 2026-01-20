package com.mbg.controller;

import com.mbg.dto.ApiResponse;
import com.mbg.dto.BranchDTO;
import com.mbg.dto.CreateBranchRequest;
import com.mbg.service.BranchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/organizations/{orgId}/branches")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('GREAT_ADMIN', 'ADMIN')")
public class BranchController {

    private final BranchService branchService;

    @PostMapping
    public ResponseEntity<ApiResponse<BranchDTO>> createBranch(
            @PathVariable UUID orgId,
            @Valid @RequestBody CreateBranchRequest request
    ) {
        BranchDTO branch = branchService.createBranch(orgId, request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Branch created successfully", branch));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BranchDTO>>> getBranches(@PathVariable UUID orgId) {
        List<BranchDTO> branches = branchService.getBranchesByOrganization(orgId);
        return ResponseEntity.ok(ApiResponse.success(branches));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BranchDTO>> getBranch(@PathVariable UUID id) {
        BranchDTO branch = branchService.getBranchById(id);
        return ResponseEntity.ok(ApiResponse.success(branch));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BranchDTO>> updateBranch(
            @PathVariable UUID id,
            @Valid @RequestBody CreateBranchRequest request
    ) {
        BranchDTO branch = branchService.updateBranch(id, request);
        return ResponseEntity.ok(ApiResponse.success("Branch updated successfully", branch));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBranch(@PathVariable UUID id) {
        branchService.deleteBranch(id);
        return ResponseEntity.ok(ApiResponse.success("Branch deleted successfully", null));
    }
}
