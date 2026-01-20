package com.mbg.controller;

import com.mbg.dto.ApiResponse;
import com.mbg.dto.GovernanceDashboardDTO;
import com.mbg.service.GovernanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/governance/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('GREAT_ADMIN')")
public class GovernanceController {

    private final GovernanceService governanceService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<GovernanceDashboardDTO>> getDashboard() {
        GovernanceDashboardDTO dashboard = governanceService.getDashboard();
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }
}
